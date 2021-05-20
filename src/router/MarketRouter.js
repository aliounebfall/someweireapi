import express from 'express';
import * as MarketController from '../controller/MarketController';
const { check} = require('express-validator');

var router = express.Router();

router.get('/artifacts', MarketController.getArtifactList);

router.get('/artifact/id/:id', [
    check('id').isInt()
], MarketController.getArtifactById);

router.get('/artifact/token/:tokenId', [
    check('tokenId').isInt()
], MarketController.getArtifactByTokenId);

router.put('/artifact/create/:playerName', [
    check('playerName').isString(),
    check('amountWeivellite').exists().isInt(),
    check('amountWeither').exists().isInt(),
    check('amountWeillenium').exists().isInt()
], MarketController.createArtifact);

router.put('/artifact/update/:id/player/:playerName', [
    check('id').isInt(),
    check('playerName').isString(),
    check('name').exists().isString(),
    check('description').exists().isString()
], MarketController.updateArtifactById);

router.put('/artifact/auction/token/:tokenId/player/:playerName', [
    check('playerName').isString(),
    check('timeInSeconds').exists().isInt(),
    check('amountWeivellite').exists().isInt(),
    check('amountWeither').exists().isInt(),
    check('amountWeillenium').exists().isInt(),
    check('tokenId').isInt()
], MarketController.createAuction);

module.exports = router;