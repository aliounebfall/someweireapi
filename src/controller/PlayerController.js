import * as playerService from '../service/PlayerService';
import * as syncService from '../service/sync/SyncService';
import { validationResult } from 'express-validator';

const tag = 'PLAYER_CONTROLLER';

export async function getPlayerList(request, response){
    const playerList = await playerService.getAllPlayers();

    if(playerList == -1) {
        response.status(500).send('Error while processing the request');
    } else {
        let result = playerList.map(player => player.toObject());
        response.json(result);
    }
}

export async function getPlayerByName(request, response){
    try {
        let errors = validationResult(request); 

        if(!errors.isEmpty())
            throw 'Invalid params';

        const player = await playerService.getPlayer(request.params.name);

        if(player == -1)
            throw 'Service error';

        if(player != false)
            response.json(player.toObject());
        else 
            response.json(player);

    } catch (error) {
        response.status(500).send('Error while processing the request : ' + error);
    }
}

export async function getPlayerByUserAddress(request, response){
    try {
        let errors = validationResult(request);

        if(!errors.isEmpty())
            throw 'Invalid params';

        const player = await playerService.getPlayerByUserAddress(request.params.userAddress);

        if(player == -1)
            throw 'Service error';

        if(player != false)
            response.json(player.toObject());
        else 
            response.json(player);

    } catch (error) {
        response.status(500).send('Error while processing the request : ' + error);
    }
}


export async function getPlayerById(request, response){
    try {
        let errors = validationResult(request);

        if(!errors.isEmpty())
            throw 'Invalid params';

        const player = await playerService.getPlayerById(parseInt(request.params.id));

        if(player == -1)
            throw 'Service error';

        if(player != false)
            response.json(player.toObject());
        else 
            response.json(player);

    } catch (error) {
        response.status(500).send('Error while processing the request : ' + error);
    }
}

export async function updatePlayer(request, response){
    try {

        let errors = validationResult(request); 

        if(!errors.isEmpty())
            throw 'Invalid params';

        let playerObject = request.body;
        const player = await playerService.updatePlayer(request.params.id, playerObject);
    
        if(player == -1)
            throw 'Service error';

        if(player != false)
            response.json(player.toObject());
        else 
            response.json(player);

    } catch (error) {
        response.status(500).send('Error while processing the request : ' + error);
    }
}

export async function createPlayer(request, response){
    try {

        if(!validationResult(request).isEmpty())
            throw 'Invalid params : ';

        let playerObject = request.body;
        const player = await playerService.createPlayer(playerObject);

        if(player == -1)
            throw 'Service error';

        let result = player.toObject();
        response.json(result);

    } catch (err) {
        response.status(500).send('Error while processing the request : ' + error);
    }
}

export async function syncPlayer(request, response){
    try {

        let errors = validationResult(request); 

        if(!errors.isEmpty())
            throw 'Invalid params';

        const player  = await syncService.sync(request.params.name);

        if(player == -1)
            throw 'Service error';

        if(player != false)
            response.json(player.toObject());
        else 
            response.json(player);

    } catch (error) {
        response.status(500).send('Error while processing the request : ' + error);
    }
}