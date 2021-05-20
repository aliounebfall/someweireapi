import * as playerDao from '../dao/PlayerDao';
import * as fragmentDao from '../dao/FragmentDao';
import logger from '../utils/log/Logger';

const tag = 'PLAYER_SERVICE';

export async function getPlayer(playerName){
    let player;

    try {
        player = await playerDao.getPlayerByName(playerName);
    } catch (error) {
        logger.error(`${tag} : ${error}`);
        player = -1;
    }

    return player;
}

export async function getPlayerById(playerId){
    let player;

    try {
        player = await playerDao.getPlayerById(playerId);
    } catch (error) {
        logger.error(`${tag} : ${error}`);
        player = -1;
    }

    return player;
}

export async function getPlayerByUserAddress(userAddress){
    let player;

    try {
        player = await playerDao.getPlayerByUserAddress(userAddress);
    } catch (error) {
        logger.error(`${tag} : ${error}`);
        player = -1;
    }

    return player;
}

export async function updatePlayer(playerId, playerObject){
    let player;

    try {
        player = await playerDao.getPlayerById(playerId);

        if(player != false)
            await playerDao.updatePlayer(player, playerObject);
    } catch (error) {
        logger.error(`${tag} : ${error}`);
        player = -1;
    }

    return player;
}



export async function createPlayer(playerObject){
    let player;

    try {
        player = await playerDao.createPlayer(playerObject);
        let allFragments = await fragmentDao.getAllFragments();
        let weivellite = allFragments[0];
        let weither = allFragments[1];
        let weillenium = allFragments[2];

        await playerDao.addFragmentToPlayer(player, weivellite, 0);
        await playerDao.addFragmentToPlayer(player, weither, 0);
        await playerDao.addFragmentToPlayer(player, weillenium, 0);

    } catch (error) {
        logger.error(`${tag} : ${error}`);
        player = -1;
    }

    return player;
}

export async function getAllPlayers(){
    let playersList;

    try {
        playersList = await playerDao.getAllPlayers();
    } catch (error) {
        logger.error(`${tag} : ${error}`);
        playersList = -1;
    }

    return playersList;
}