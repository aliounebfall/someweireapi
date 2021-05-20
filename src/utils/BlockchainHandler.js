import {EventEmitter} from 'events';
import {fromEvent} from 'rxjs';

// Token handling
export const tokenMintEmitter = new EventEmitter();
export const tokenMintObservable = fromEvent(tokenMintEmitter, 'tokenmint');

/* unused events*/
export const tokenTransferEmitter = new EventEmitter();
export const tokenBurnEmitter = new EventEmitter();

/* unused observables*/
export const tokenTransferObservable = fromEvent(tokenTransferEmitter, 'tokentransfer');
export const tokenBurnObservable = fromEvent(tokenBurnEmitter, 'tokenburn');

// NFT handling
export const nftMintEmitter = new EventEmitter();
export const nftTransferEmitter = new EventEmitter();

export const nftMintObservable = fromEvent(nftMintEmitter, 'nftmint');
export const nftTransferObservable = fromEvent(nftTransferEmitter, 'nfttransfer');

// Error Handling
export const nftMintErrorEmitter = new EventEmitter();
export const nftMintErrorObservable = fromEvent(nftMintErrorEmitter, 'nftminterror');

export const nftTransferErrorEmitter = new EventEmitter();
export const nftTransferErrorObservable = fromEvent(nftTransferErrorEmitter, 'nfttransfererror');

export const tokenTransferErrorEmitter = new EventEmitter();
export const tokenTransferErrorObservable = fromEvent(tokenTransferErrorEmitter, 'tokentransfererror');

export const typeMapping = ['Technology', 'Art', 'Material'];

export const rarityMapping = ['Common', 'Rare', 'Legendary'];

export function getTopicFromAddress(tokenAddress){
    let topic;

    switch (tokenAddress) {
        case process.env.ETH_WEIVELLITE_ERC20:
            topic = process.env.KAFKA_TOPIC_WEIVELLITE;
            break;
        case process.env.ETH_WEITHER_ERC20:
            topic = process.env.KAFKA_TOPIC_WEITHER;
            break;
        case process.env.ETH_WEILLENIUM_ERC20:
            topic = process.env.KAFKA_TOPIC_WEILLENIUM;
            break;
        default:
            break;
    }

    return topic;
}

export function getTypeFromAddress(tokenAddress){
    let topic = getTopicFromAddress(tokenAddress);
    let type;

    switch (topic) {
        case process.env.KAFKA_TOPIC_WEIVELLITE:
            type = 'Weivellite';
            break;
        case process.env.KAFKA_TOPIC_WEITHER:
            type = 'Weither';
            break;
        case process.env.KAFKA_TOPIC_WEILLENIUM:
            type = 'Weillenium';
            break;
        default:
            break;
    }

    return type;
}

export function buildPaymentFromTransfer(type, amount) {

    let paymentObject;

    switch (type) {
        case 'Weivellite':
            paymentObject = {
                priceWeivellite: amount, 
                priceWeither: 0,
                priceWeillenium: 0
            }
            break;
        case 'Weither':
            paymentObject = {
                priceWeivellite: 0, 
                priceWeither: amount,
                priceWeillenium: 0
            }
            break;
        case 'Weillenium':
            paymentObject = {
                priceWeivellite: 0, 
                priceWeither: 0,
                priceWeillenium: amount
            }
            break;
        default:
            break;
    }

    return paymentObject;
}