import * as playerDao from '../dao/PlayerDao';
import * as enigmeDao from '../dao/EnigmeDao';
import * as web3TokenService from './web3/Web3TokenService';
import {tokenMintObservable} from '../utils/BlockchainHandler';
import * as PlayerHandler from '../utils/PlayerHandler';
import * as EnigmeHandler from '../utils/EnigmeHandler';

import { first } from 'rxjs/operators';

import logger from '../utils/log/Logger';

const tag = 'ENIGME_SERVICE';


export async function trySolveEnigme(playerName, enigmeNumero, solution) {
    let player;
    let timeout = 'Mint event from transfer timed-out. Could not resolve updated state.';

    try {
        player = await playerDao.getPlayerByName(playerName);
        const enigme = await enigmeDao.getEnigmeByNumero(enigmeNumero);

        if(player != false && enigme != false) {
            const fragment = EnigmeHandler.getFragment(enigme);
            const reward = EnigmeHandler.getRewardsFragment(enigme).getQuantite();

            if(enigme
                .getSolution()
                .toLowerCase() === solution.toLowerCase() && !PlayerHandler.hasEnigme(player, enigme.getId())){
    
                await web3TokenService.mintFragment(player, fragment.getType(), reward);
    
                await playerDao.addSolvedEnigmeToPlayer(player, enigme);
    
                let timer;
    
                let updatedPlayer = await Promise
                                        .race([tokenMintObservable.pipe(first()).toPromise(),
                                                new Promise((_r, reject) => timer = setTimeout(() => reject(timeout), 10000))])
                                        .finally(() => clearTimeout(timer));
    
                if(updatedPlayer == -1)
                    throw 'Mint event from transfer returned an error. Could not update state.';
    
                player = updatedPlayer;
            }
        } else 
            player = false;
    } catch (error) {
        logger.error(`${tag} : ${error}`);
        player = -1;
    }

    return player;
}

export async function getEnigmeList(){
    let enigmeList;

    try {
        enigmeList = await enigmeDao.getAllEnigmes();
    } catch (error) {
        logger.error(`${tag} : ${error}`);
        enigmeList = -1;
    }

    return enigmeList;
}

export async function getEnigmeByNumero(enigmeNumero){
    let enigme;

    try {
        enigme = await enigmeDao.getEnigmeByNumero(enigmeNumero);
    } catch (error) {
        logger.error(`${tag} : ${error}`);
        enigme = -1;
    }

    return enigme;
}