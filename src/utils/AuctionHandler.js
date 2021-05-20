import Auction from '../model/classes/AuctionClass.js';

export function getAuctionFromNode(node) {
    return new Auction(
        node.identity().toInt(),
        node.get('address'), 
        node); 
}