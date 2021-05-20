import * as enigmeService from '../service/EnigmeService';
import { validationResult } from 'express-validator';

const tag = 'ENIGME_CONTROLLER';

export async function getEnigmeList(request, response){
    const enigmeList = await enigmeService.getEnigmeList();

    if(enigmeList == -1) {
        response.status(500).send('Error while processing the request');
    } else {
        let result = enigmeList.map(enigme => enigme.toObject());
        response.json(result);
    }
}

export async function getEnigmeByNumero(request, response){
    try {

        let errors = validationResult(request); 

        if(!errors.isEmpty())
            throw 'Invalid params';

        const enigme = await enigmeService.getEnigmeByNumero(parseInt(request.params.numero));

        if(enigme == -1)
            throw 'Service error';

        if(enigme != false)
            response.json(enigme.toObject());
        else 
            response.json(enigme);
        
    } catch (error) {
        response.status(500).send('Error while processing the request : ' + error);
    }
}

export async function solveEnigmeByNumero(request, response){
    try {

        let errors = validationResult(request); 

        if(!errors.isEmpty())
            throw 'Invalid params';

        let numero = parseInt(request.params.numero);
        let playerName = request.body.playerName;
        let solution = request.body.solution;

        const player = await enigmeService.trySolveEnigme(playerName, numero, solution);

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