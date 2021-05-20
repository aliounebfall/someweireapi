import {weivelitteContract, weitherContract, weilleniumContract, artifactContract, artifactAuctionContract} from '../../utils/provider/Web3Provider';

const tag = 'WEB3_AUCTION_SERVICE';

export async function createAuction(player, timeInSeconds, amountsObject, tokenId){
    let playerAddress = player.getUserAddress();
    
    let returnObject = {};

    let contract = await artifactAuctionContract
                .deploy({
                    arguments: [playerAddress, 
                                timeInSeconds,
                                amountsObject,
                                tokenId,
                                weivelitteContract.options.address,
                                weitherContract.options.address,
                                weilleniumContract.options.address,
                                artifactContract.options.address]
                }).send();

    returnObject['address'] = contract.options.address;
    return returnObject;
}