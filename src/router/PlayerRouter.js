import express from 'express';
import * as PlayerController from '../controller/PlayerController';
const { check, oneOf} = require('express-validator');

var router = express.Router();

router.get('/players', PlayerController.getPlayerList);

router.get('/player/id/:id', [
    check('id').isInt()
], PlayerController.getPlayerById);

router.get('/player/name/:name', [
    check('name').isString()
], PlayerController.getPlayerByName);

router.get('/player/address/:userAddress', [
    check('userAddress').isString()
], PlayerController.getPlayerByUserAddress);

router.put('/player/update/:id', [
    check('id').isInt(),
    check('name').exists().isString(), 
    check('description').exists().isString(),
    check('userAddress').exists().isString()
], PlayerController.updatePlayer);

router.post('/player/create', [
    check('name').exists().isString(), 
    check('description').exists().isString(),
    check('userAddress').exists().isString()
], PlayerController.createPlayer);

router.put('/player/sync/:name', [
    check('name').isString()
], PlayerController.syncPlayer);

module.exports = router;