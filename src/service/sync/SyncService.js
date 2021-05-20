import logger from '../../utils/log/Logger';
import * as PlayerHandler from '../../utils/PlayerHandler';
import * as web3TokenService from '../web3/Web3TokenService';
import * as web3NFTService from '../web3/Web3NFTService';
import * as playerDao from '../../dao/PlayerDao';
import * as artifactDao from '../../dao/ArtifactDao';

const tag = 'SYNC_SERVICE';

const tokens = ['Weivellite', 'Weither', 'Weillenium'];

async function syncToken(player, type) {
    let localBalance = PlayerHandler.getHasFragmentByType(player, type).getHas();

    let contractBalance = await web3TokenService.getBalanceOf(player, type); 

    if(contractBalance != localBalance) {
        await playerDao.updateHasFragmentByTypeToPlayer(player, type, contractBalance)

        logger.info(`${tag} : Synced amount to player - `
        + `${player.getName()} - had ${localBalance} ${type} - `
        + `Has now ${PlayerHandler.getHasFragmentByType(player, type).getHas()} ${type}`);
    } else {
        logger.info(`${tag} : ${localBalance} ${type} already synced for player - ${player.getName()}`);
    }
}

async function syncArtifact(player) {
    // NFT Sync
    let balance = await web3NFTService.getBalanceOf(player);
    let localArtifacts = PlayerHandler.getArtifactsArray(player);

    for(let i = 0; i <= balance -1; i++){
        let tokenId = await web3NFTService.tokenOfPlayerByIndex(player, i);

        if(!PlayerHandler.hasArtifactByTokenId(player, tokenId)) {
            let artifactObject = await web3NFTService.getArtifact(tokenId); 

            let artifact = await artifactDao.getArtifactByTokenId(tokenId);

            if(artifact == false) {
                // Artifact doesn't exist
                artifactObject.name = `Artifact ${artifactObject.tokenId}`;
                artifactObject.description = `${artifactObject.rarity} ${artifactObject.artifactType} artifact`;
                artifact = await artifactDao.createArtifact(artifactObject);
            }

            await playerDao.addArtifactToPlayer(player, artifact);

            logger.info(`${tag} : Synced artifact to player - `
            + `${player.getName()} - `
            + `Has now artifact ${PlayerHandler.getArtifact(player, artifact.getId())}`);
        } else {
            localArtifacts = localArtifacts.filter(artifact => artifact.getTokenId() != tokenId);
            logger.info(`${tag} : Artifact ${tokenId} already synced for player - ${player.getName()}`);
        }
    }

    if(localArtifacts.length != 0) {
        for(let artifact of localArtifacts){
            await playerDao.removeArtifactFromPlayer(player, artifact);
            logger.info(`${tag} : Removed artifact ${artifact.getTokenId()} from player - ${player.getName()}`);
        }
    }
}

export async function sync(playerName) {
    let player;

    try {
        player = await playerDao.getPlayerByName(playerName);

        if(player != false) {
            for(let token of tokens){
                await syncToken(player, token)
            }
    
            await syncArtifact(player);
        }
    } catch (error) {
        logger.error(`${tag} : ${error}`);
        player = -1;
    }

return player;
}