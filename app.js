import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import enigmeRouter from './src/router/EnigmeRouter';
import playerRouter from './src/router/PlayerRouter';
import marketRouter from './src/router/MarketRouter';
import * as errorController from './src/controller/ErrorController';
import {subscribeTokenTransferEvent} from './src/service/event/TokenTransferEventService';
import {subscribeNFTMintEvent} from './src/service/event/NFTMintEventService';
import {subscribeNFTTransferEvent} from './src/service/event/NFTTransferEventService';
import {tokenTransferErrorObservable, nftTransferErrorObservable, nftMintErrorObservable} from './src/utils/BlockchainHandler';

import logger from './src/utils/log/Logger';

const tag = 'SOMEWEIRE SERVER';

const SOMEWEIRE_BASE_URL = process.env.APP_BASE_URL;

const ethNode = process.env.ETH_NODE_WS;
const kafkaBroker = process.env.KAFKA_BROKER;
const port = process.env.APP_PORT;

const log = `\n-LISTENING ON PORT : ${port}\n-ETH NODE URL: ${ethNode}\n-KAFKA BROKER URL: ${kafkaBroker}`;

const WVTS = process.env.ETH_WEIVELLITE_ERC20;
const WTRS = process.env.ETH_WEITHER_ERC20;
const WNMS = process.env.ETH_WEILLENIUM_ERC20;
const ARTFCS = process.env.ETH_ARTIFACT_ERC721;

const tokens = [WVTS, WTRS, WNMS];

const server = express();

server.use(morgan("tiny"));
server.use(bodyParser.json());

server.use(SOMEWEIRE_BASE_URL, enigmeRouter);
server.use(SOMEWEIRE_BASE_URL, playerRouter);
server.use(SOMEWEIRE_BASE_URL, marketRouter);
server.use(errorController.handle404);

server.listen(port, ()=>{
    logger.info(`${tag} :${log}`);
});

// Subscribing to token transfer events
tokens.forEach(token => subscribeTokenTransferEvent(token));

// Subscribing to NFT mint events
subscribeNFTMintEvent();

// Subscribing to NFT transfer events
subscribeNFTTransferEvent();

// Re subscribing to errored out subscriptions
tokenTransferErrorObservable.subscribe((tokenAddress) => {
    subscribeTokenTransferEvent(tokenAddress);
});

nftMintErrorObservable.subscribe(() => {
    subscribeNFTMintEvent();
});

nftTransferErrorObservable.subscribe(() => {
    subscribeNFTTransferEvent();
});

module.exports = {
    app: server,
    url: SOMEWEIRE_BASE_URL
}