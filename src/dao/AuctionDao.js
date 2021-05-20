import {getDb} from './Dao';
import { getAuctionFromNode } from '../utils/AuctionHandler';

const db = getDb();

export async function getAllAuctions() {
    const auctionsCollection = [];
    const result = await db.all('Auction');

    result.forEach((node) => {
        auctionsCollection.push(getAuctionFromNode(node));
    });

    return auctionsCollection;
}

export async function getAuctionByAddress(address) {
    const auctionNode = await db.first('Auction', {address: address});

    if(auctionNode != false) 
        return getAuctionFromNode(auctionNode);
    else 
        return auctionNode;
}

export async function getAuctionById(id) {
    const auctionNode = await db.findById('Auction', id);

    if(auctionNode != false)
        return getAuctionFromNode(auctionNode);
    else 
        return auctionNode;
}

export async function createAuction(address) {
    const auctionNode = await db.create('Auction', {address: address});

    return getAuctionFromNode(auctionNode);
}