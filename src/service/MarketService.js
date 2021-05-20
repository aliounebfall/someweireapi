import * as playerDao from '../dao/PlayerDao';
import * as artifactDao from '../dao/ArtifactDao';
import * as auctionDao from '../dao/AuctionDao';
import * as web3NFTService from './web3/Web3NFTService';
import * as web3AuctionService from './web3/Web3AuctionService';
import {nftMintObservable} from '../utils/BlockchainHandler';
import {hasArtifactByTokenId, getHasArtifact, hasArtifactById} from '../utils/PlayerHandler';
import { first } from 'rxjs/operators';

import logger from '../utils/log/Logger';

const tag = 'MARKET_SERVICE';

export async function getArtifactList(){
    let artifactList;

    try {
        artifactList = await artifactDao.getAllArtifacts();
    } catch (error) {
        logger.error(`${tag} : ${error}`);
        artifactList = -1;
    }

    return artifactList;
}

export async function getArtifactById(artifactId){
    let artifact;

    try {
        artifact = await artifactDao.getArtifactById(artifactId);
    } catch (error) {
        logger.error(`${tag} : ${error}`);
        artifact = -1;
    }

    return artifact;
}

export async function getArtifactByTokenId(tokenId){
    let artifact;

    try {
        artifact = await artifactDao.getArtifactByTokenId(tokenId);
    } catch (error) {
        logger.error(`${tag} : ${error}`);
        artifact = -1;
    }

    return artifact;
}

export async function updateArtifactById(playerName, artifactId, artifactObject){
    let player;

    try {
        player = await playerDao.getPlayerByName(playerName);

        if(player != false && hasArtifactById(player, artifactId)){
            await playerDao.updateArtifactAttributesFromPlayer(player, artifactId, artifactObject);
        } else player = false
        
    } catch (error) {
        logger.error(`${tag} : ${error}`);
        player = -1;
    }

    return player;
}

export async function createArtifact(playerName, amounts){
    let player;
    let timeout = 'Mint event from creation timed-out. Could not resolve updated state.';

    try {
        player = await playerDao.getPlayerByName(playerName);

        if(player != false) {
            let returnObject = await web3NFTService.mintArtifact(player, amounts);

            if(returnObject.tokenId == null)
                throw 'Error from contract mint operation';
    
            let timer;
    
            let artifact = await Promise
                                    .race([nftMintObservable.pipe(first()).toPromise(),
                                            new Promise((_r, reject) => timer = setTimeout(() => reject(timeout), 10000))])
                                    .finally(() => clearTimeout(timer));
    
            if(artifact == -1)
                throw 'Mint event from creation returned an error. Could not update state.';
    
            await playerDao.addArtifactToPlayer(player, artifact);
        }
    } catch (error) {
        logger.error(`${tag} : ${error}`);
        player = -1;
    }
    return player;
}

export async function createAuction(playerName, timeInSeconds, amounts, tokenId){
    let player;

    try {
        player = await playerDao.getPlayerByName(playerName);

        let artifact = await artifactDao.getArtifactByTokenId(tokenId);

        if(player != false &&
            artifact != false &&
            hasArtifactByTokenId(player, tokenId)) {
                let returnObject = await web3AuctionService
                .createAuction(player,
                                timeInSeconds,
                                amounts,
                                tokenId);

                if(returnObject.address == null)
                throw 'Error from auction creation operation';

                let auction = await auctionDao.createAuction(returnObject.address);


                await playerDao.addAuctionToPlayer(player, auction);

                await playerDao.updateArtifactSoldFromPlayer(player, artifact.getId(), true);
        } else player = false;

    } catch (error) {
        logger.error(`${tag} : ${error}`);
        player = -1;
    }

    return player;
}