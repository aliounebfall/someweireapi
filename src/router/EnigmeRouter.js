import express from 'express';
import * as EnigmeController from '../controller/EnigmeController';
const { check, oneOf} = require('express-validator');

var router = express.Router();

router.get('/enigmes', EnigmeController.getEnigmeList);

router.get('/enigme/:numero', [
    check('numero').isInt()
], EnigmeController.getEnigmeByNumero);

router.put('/enigme/solve/:numero', [
    check('numero').isInt(), 
    check('playerName').exists().isString(), 
    check('solution').exists().isString()
], EnigmeController.solveEnigmeByNumero);


module.exports = router;