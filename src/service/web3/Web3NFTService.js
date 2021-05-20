import {artifactContract} from '../../utils/provider/Web3Provider';
import * as BlockChainHandler from '../../utils/BlockchainHandler';

const tag = 'WEB3_NFT_SERVICE';

export async function mintArtifact(player, amountsObject){
    let playerAddress = player.getUserAddress();

    let returnObject = {};

    let tx = await artifactContract
                .methods
                .mintArtifact(playerAddress, amountsObject)
                .send();

    returnObject['address'] = tx.events.Transfer.returnValues.to;
    returnObject['tokenId'] = parseInt(tx.events.Transfer.returnValues.tokenId);
    returnObject['artifactType'] = BlockChainHandler.typeMapping[tx.events.Mint.returnValues.artifactType];
    returnObject['rarity'] = BlockChainHandler.rarityMapping[tx.events.Mint.returnValues.rarity];

    return returnObject;
}

export async function getArtifact(tokenId){

    let returnObject = {};

    let result = await artifactContract
                .methods
                .getArtifact(tokenId)
                .call();

    returnObject['tokenId'] = tokenId;
    returnObject['artifactType'] = BlockChainHandler.typeMapping[result.artifactType];
    returnObject['rarity'] = BlockChainHandler.rarityMapping[result.rarity];

    return returnObject;
}

export async function getAllArtifacts(){

    let returnArray = [];
    
    let returnObject = await artifactContract
                .methods
                .getArtifacts()
                .call();

    returnObject.forEach(result => {
        returnArray.push(
            {artifactType: BlockChainHandler.typeMapping[result.artifactType],
                rarity: BlockChainHandler.rarityMapping[result.rarity]
             });
    });

    return returnArray;
}

export async function getBalanceOf(player){
    let playerAddress = player.getUserAddress();
    
    let returnValue = await artifactContract
                .methods
                .balanceOf(playerAddress)
                .call();

    return parseInt(returnValue);
}

export async function ownerOf(tokenId){
    let returnValue = await artifactContract
                .methods
                .ownerOf(tokenId)
                .call();

    return returnValue;
}

export async function tokenOfPlayerByIndex(player, index){
    let playerAddress = player.getUserAddress();

    let returnValue = await artifactContract
                .methods
                .tokenOfOwnerByIndex(playerAddress, index)
                .call();

    return parseInt(returnValue);
}

export async function getSymbol(){
    return await artifactContract
                .methods
                .symbol()
                .call();
}