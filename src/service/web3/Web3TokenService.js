import {weivelitteContract, weitherContract, weilleniumContract} from '../../utils/provider/Web3Provider';

const tag = 'WEB3_TOKEN_SERVICE';

const wvt = weivelitteContract;
const wtr = weitherContract;
const wnm = weilleniumContract;


export async function mintFragment(player, type, amount){
    let playerAddress = player.getUserAddress();
    
    let returnObject = {};

    let tx = await getContractByType(type)
                .methods
                .mint(playerAddress, amount)
                .send();

    returnObject['address'] = tx.events.Transfer.returnValues.to;
    returnObject['quantite'] = parseInt(tx.events.Transfer.returnValues.value);

    return returnObject;
}

export async function getBalanceOf(player, type){
    let playerAddress = player.getUserAddress();
    
    let returnValue = await getContractByType(type)
                .methods
                .balanceOf(playerAddress)
                .call();

    return parseInt(returnValue);
}

export async function getTotalSupplyOfType(type){
    let returnValue = await getContractByType(type)
                .methods
                .totalSupply()
                .call();

    return parseInt(returnValue);
}

export async function getSymbolOfType(type){
    return await getContractByType(type)
                .methods
                .symbol()
                .call();
}


function getContractByType(type){
    let contract;

    switch (type.toLowerCase()) {
        case 'weivellite':
            contract = wvt;
            break;
        case 'weither':
            contract = wtr;
            break;
        case 'weillenium':
            contract = wnm;
            break;
        default:
            break;
    }
    return contract;
}