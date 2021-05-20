import Web3 from 'web3';
import WeivelliteJSON from '../../../build/contracts/Weivellite.json';
import WeitherJSON from '../../../build/contracts/Weither.json';
import WeilleniumJSON from '../../../build/contracts/Weillenium.json';
import ArtifactJSON from '../../../build/contracts/Artifact.json';
import ArtifactAuctionJSON from '../../../build/contracts/ArtifactAuction.json';

const weivellitteAbi = WeivelliteJSON.abi;
const weivelliteAddress = process.env.ETH_WEIVELLITE_ERC20;

const weitherAbi = WeitherJSON.abi;
const weitherAddress = process.env.ETH_WEITHER_ERC20;

const weilleniumAbi = WeilleniumJSON.abi;
const weilleniumAddress = process.env.ETH_WEILLENIUM_ERC20;

const artifactAbi = ArtifactJSON.abi;
const artifactAddress = process.env.ETH_ARTIFACT_ERC721;

const artifactAuctionAbi = ArtifactAuctionJSON.abi;
const artifactAuctionData = ArtifactAuctionJSON.bytecode;

const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.ETH_NODE_WS));

const weivelitteContract = new web3.eth.Contract(weivellitteAbi, weivelliteAddress, {
    from: process.env.ETH_SERVER_ADDRESS,
    gasPrice: 0
});

const weitherContract = new web3.eth.Contract(weitherAbi, weitherAddress, {
    from: process.env.ETH_SERVER_ADDRESS,
    gasPrice: 0
});

const weilleniumContract = new web3.eth.Contract(weilleniumAbi, weilleniumAddress, {
    from: process.env.ETH_SERVER_ADDRESS,
    gasPrice: 0
});

const artifactContract = new web3.eth.Contract(artifactAbi, artifactAddress, {
    from: process.env.ETH_SERVER_ADDRESS,
    gasPrice: 0, 
    gas: 8500000
});

const artifactAuctionContract = new web3.eth.Contract(artifactAuctionAbi, {
    from: process.env.ETH_SERVER_ADDRESS,
    gasPrice: 0, 
    gas: 8500000,
    data: artifactAuctionData
});


module.exports = {
    web3: web3,
    weivelitteContract: weivelitteContract,
    weitherContract: weitherContract,
    weilleniumContract: weilleniumContract,
    artifactContract: artifactContract,
    artifactAuctionContract: artifactAuctionContract
}