import * as NFTTransferSubscriber from '../../subscriber/NFTTransferSubscriber';
import * as PlayerDao from '../../dao/PlayerDao';
import * as ArtifactDao from '../../dao/ArtifactDao';
import * as PlayerHandler from '../../utils/PlayerHandler';
import {catchError} from "rxjs/operators";
import {of} from "rxjs";
import * as BlockChainHandler from '../../utils/BlockchainHandler';
import Player from '../../model/classes/PlayerClass';

import logger from '../../utils/log/Logger';

const tag = 'NFT_TRANSFER_EVENT_SERVICE';

export function subscribeNFTTransferEvent(){
    let subscriber = NFTTransferSubscriber.getNftTransferSubscriber();

    subscriber
        .pipe(
            catchError(err => {
                if(err.name != process.env.KAFKA_ECONNREFUSED){
                    BlockChainHandler.nftTransferEmitter.emit('nfttransfer', -1);
                    BlockChainHandler.nftTransferErrorEmitter.emit('nfttransfererror');

                    logger.error(`${tag} : Error while receiving object - ${err}`);
                } else 
                    logger.error(`${tag} : ${err}`);

                return of(-1);
            })
        )
        .subscribe((transferObject) => {
            if(transferObject != -1) {
                try {
                    let blockNumber = parseInt(transferObject.blockNumber);
                    let from = transferObject.from;
                    let to = transferObject.to;
                    let nft = transferObject.nft;
                    let tokenId = transferObject.tokenId;
        
                    let topic = process.env.KAFKA_TOPIC_ARTIFACT_TRANSFER;
        
                    logger.info(`${tag} : ${topic} event received : ${JSON.stringify(transferObject)}`);
        
                    PlayerDao
                        .getPlayerByUserAddress(to)
                        .then(receiving => {
                            PlayerDao
                                .getPlayerByUserAddress(from)
                                .then(paying => {
                                    ArtifactDao
                                        .getArtifactByTokenId(tokenId)
                                        .then(artifact => {
                                            if(receiving == false)
                                                receiving = to;
                                            if(paying == false)
                                                paying = from;
                                            updateFromTransfer(receiving, paying, artifact);
                                        });
                                });
                        });
                } catch (err) {
                    BlockChainHandler.nftTransferEmitter.emit('nfttransfer', -1);
                    logger.error(`${tag} : Error while processing object - ${err}`);
                }
            }
        });
}

async function updateFromTransfer(receiving, paying, artifact) {
    try {
        let receivingName, payingName;

        let log = `${tag} : Regular transfer - Artifact ${artifact.getTokenId()} - ${artifact.getName()} `;
    
        if(paying instanceof Player) {
            await PlayerDao
            .removeArtifactFromPlayer(paying, artifact);

            payingName = paying.getName();
        } else payingName = paying;
    
        if(receiving instanceof Player){
            await PlayerDao
            .addArtifactToPlayer(receiving, artifact);

            receivingName = receiving.getName();
        } else receivingName = receiving;

        BlockChainHandler.nftMintEmitter.emit('nfttransfer', receiving, paying);

        log += `- to ${receivingName} from ${payingName} `;
    
        if(receiving instanceof Player)
            log += `- ${receivingName} has now ${PlayerHandler.getArtifactsArray(receiving).length} artifacts `;

        if(paying instanceof Player)
            log += `- ${payingName} has now ${PlayerHandler.getArtifactsArray(paying).length} artifacts`;

        logger.info(log);
    } catch (err) {
        logger.error(`${tag} : Error while updating from transfer - ${err}`);
    }
}