import * as TokenTransferSubscriber from '../../subscriber/TokenTransferSubscriber';
import * as PlayerDao from '../../dao/PlayerDao';
import * as FragmentDao from '../../dao/FragmentDao';
import * as PlayerHandler from '../../utils/PlayerHandler';
import * as BlockChainHandler from '../../utils/BlockchainHandler';
import {catchError} from "rxjs/operators";
import {of} from "rxjs";
import Player from '../../model/classes/PlayerClass';

import logger from '../../utils/log/Logger';

const tag = 'TOKEN_TRANSFER_EVENT_SERVICE';

export function subscribeTokenTransferEvent(tokenAddress){
    let subscriber = TokenTransferSubscriber.getTokenTransferSubscriber(tokenAddress);

    subscriber
        .pipe(
            catchError(err => {
                if(err.name != process.env.KAFKA_ECONNREFUSED){
                    BlockChainHandler.tokenMintEmitter.emit('tokenmint', -1);
                    BlockChainHandler.tokenTransferEmitter.emit('tokentransfer', -1);
                    BlockChainHandler.tokenTransferErrorEmitter.emit('tokentransfererror', tokenAddress);

                    logger.error(`${tag} : Error while receiving object - ${err}`);
                } else 
                    logger.error(`${tag} : ${err}`);

                return of(-1);
            })
        )
        .subscribe((transferObject) => {
            if(transferObject != -1){
                try {
                    let blockNumber = parseInt(transferObject.blockNumber);
                    let from = transferObject.from;
                    let to = transferObject.to;
                    let amount = transferObject.amount;
                    let token = transferObject.token;

                    let topic = BlockChainHandler.getTopicFromAddress(token);
                    let type = BlockChainHandler.getTypeFromAddress(token);

                    logger.info(`${tag} : ${topic} event received : ${JSON.stringify(transferObject)}`);

                    if (parseInt(to) == 0) {
                        // Token has been burned
                        PlayerDao
                        .getPlayerByUserAddress(from)
                        .then(paying => {
                            if(paying != false)
                                updateFromBurn(paying, amount, type);
                            else logBurn(from, amount, type)
                        });
                    } else {
                        PlayerDao
                        .getPlayerByUserAddress(to)
                        .then(receiving => {
                                if(parseInt(from) == 0){
                                    // Token has been minted and is from an enigme
                                    updateFromMint(receiving, amount, type);
                                } else 
                                    // Token is from a regular transfer
                                    PlayerDao
                                    .getPlayerByUserAddress(from)
                                    .then(paying => {
                                        if(receiving == false)
                                            receiving = to;
                                        if(paying == false)
                                            paying = from;
                                        updateFromTransfer(receiving, paying, amount, type);
                                    });
                        });
                    }
                } catch (err) {
                    BlockChainHandler.tokenMintEmitter.emit('tokenmint', -1);
                    BlockChainHandler.tokenTransferEmitter.emit('tokentransfer', -1);
                    logger.error(`${tag} : Error while processing object - ${err}`);
                }
            }
        });
}

async function updateFromMint(receiving, amount, type) {
    try {
        let fragment = PlayerHandler.getFragmentByType(receiving, type);
        let newObtained = fragment.getObtained() + amount;
        let newAmount = PlayerHandler.getHasFragmentByType(receiving, type).getHas() + amount;
    
        await PlayerDao
        .updateHasFragmentToPlayer(receiving, fragment.getId(), newAmount)
        
        await FragmentDao
        .updateFragmentObtained(fragment, newObtained);
        
        BlockChainHandler.tokenMintEmitter.emit('tokenmint', updatedReceiving);
        logMint(updatedReceiving, amount, type, updatedFragment);    
    } catch (err) {
        logger.error(`${tag} : Error while updating from mint - ${err}`);
    }
    
}

async function updateFromBurn(paying, amount, type) {
    try {
        let fragment = PlayerHandler.getFragmentByType(paying, type);
        let newAmount = PlayerHandler.getHasFragmentByType(paying, type).getHas() - amount;
    
        await PlayerDao
        .updateHasFragmentToPlayer(paying, fragment.getId(), newAmount);
      
        BlockChainHandler.tokenBurnEmitter.emit('tokenburn', updatedPaying);
        logBurn(updatedPaying, amount, type);    
    } catch (err) {
        logger.error(`${tag} : Error while updating from burn - ${err}`);
    }
}

async function updateFromTransfer(receiving, paying, amount, type) {
    try {
        let fragment = await FragmentDao.getFragmentByType(type);

        let newAmountForReceiving, newAmountForPaying;
    
        if(receiving instanceof Player) {
            newAmountForReceiving = PlayerHandler.getHasFragmentByType(receiving, type).getHas() + amount;
    
            await PlayerDao
            .updateHasFragmentToPlayer(receiving, fragment.getId(), newAmountForReceiving);
        }
    
        if(paying instanceof Player) {
            newAmountForPaying = PlayerHandler.getHasFragmentByType(paying, type).getHas() - amount;
    
            await PlayerDao
            .updateHasFragmentToPlayer(paying, fragment.getId(), newAmountForPaying);
        }
    
        BlockChainHandler.tokenTransferEmitter.emit('tokentransfer', receiving, paying);
    
        logTransfer(receiving, paying, amount, type);
    } catch (err) {
        logger.error(`${tag} : Error while updating from transfer - ${err}`);
    }
}

function logMint(receiving, amount, type, fragment){
    let log = `${tag} : Minted amount added to player `;
    log += `- ${receiving.getName()} - ${amount} ${type} `
    log += `- Has now ${PlayerHandler.getHasFragmentByType(receiving, type).getHas()} ${type} `
    log += `- Total ${type} minted : ${fragment.getObtained()}`;

    logger.info(log);
}

function logBurn(paying, amount, type){
    let name;
    let log = `${tag} : Burned fragment substracted to - `;
    
    if(paying instanceof Player){
        name = paying.getName();
    } else name = paying;

    log += `${name} - ${amount} ${type} `

    if(paying instanceof Player){
        log += `- Has now ${PlayerHandler.getHasFragmentByType(paying, type).getHas()} ${type}`;
    }

    logger.info(log);
}

function logTransfer(receiving, paying, amount, type){
    let receivingName, payingName;
    let log = `${tag} : Regular transfer - `;

    if(receiving instanceof Player){
        receivingName = receiving.getName();
    } else receivingName = receiving;

    log += `${amount} ${type} to ${receivingName} `

    if(paying instanceof Player){
        payingName = paying.getName();
    } else payingName = paying;

    log += `- from ${payingName} `

    if(receiving instanceof Player){
        log += `- ${receivingName} has now ${PlayerHandler.getHasFragmentByType(receiving, type).getHas()} `
    }

    if(paying instanceof Player){
        log += `- ${paying.getName()} has now ${PlayerHandler.getHasFragmentByType(paying, type).getHas()}`;
    }

    logger.info(log);
}