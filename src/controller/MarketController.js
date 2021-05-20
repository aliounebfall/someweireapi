import * as marketService from '../service/MarketService';
import { validationResult } from 'express-validator';

const tag = 'MARKET_CONTROLLER';

export async function getArtifactList(request, response){
    const artifactList = await marketService.getArtifactList();

    if(artifactList == -1) {
        response.status(500).send('Error while processing the request');
    } else {
        let result = artifactList.map(artifact => artifact.toObject());
        response.json(result);
    }
}

export async function getArtifactById(request, response){
    try {

        let errors = validationResult(request); 

        if(!errors.isEmpty())
            throw 'Invalid params';

        const artifact = await marketService.getArtifactById(parseInt(request.params.id));

        if(artifact == -1)
            throw 'Service error';

        if(artifact != false)
            response.json(artifact.toObject());
        else
            response.json(artifact);

    } catch (error) {
        response.status(500).send('Error while processing the request : ' + error);
    }
}

export async function getArtifactByTokenId(request, response){
    try {

        let errors = validationResult(request); 

        if(!errors.isEmpty())
            throw 'Invalid params';

        const artifact = await marketService.getArtifactByTokenId(parseInt(request.params.tokenId));

        if(artifact == -1)
            throw 'Service error';

        if(artifact != false)
            response.json(artifact.toObject());
        else
            response.json(artifact);

    } catch (error) {
        response.status(500).send('Error while processing the request : ' + error);
    }
}

export async function updateArtifactById(request, response){
    try {

        let errors = validationResult(request); 

        if(!errors.isEmpty())
            throw 'Invalid params';

        let playerName = request.params.playerName;
        let artifactId = parseInt(request.params.id);
        let artifactObject = request.body;

        const player = await marketService.updateArtifactById(playerName, artifactId, artifactObject);

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


export async function createArtifact(request, response){
    try {

        let errors = validationResult(request); 

        if(!errors.isEmpty())
            throw 'Invalid params';

        let amounts = {
            amountWeivellite: request.body.amountWeivellite, 
            amountWeither: request.body.amountWeither,
            amountWeillenium: request.body.amountWeillenium
        };

        const player = await marketService.createArtifact(request.params.playerName, amounts);

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

export async function createAuction(request, response){
    try {
        let errors = validationResult(request); 

        if(!errors.isEmpty())
            throw 'Invalid params';

        let amounts = {
                amountWeivellite: request.body.amountWeivellite, 
                amountWeither: request.body.amountWeither,
                amountWeillenium: request.body.amountWeillenium
        };

        const player = await marketService.createAuction(request.params.playerName,
                                                        request.body.timeInSeconds,
                                                        amounts,
                                                        parseInt(request.params.tokenId));

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