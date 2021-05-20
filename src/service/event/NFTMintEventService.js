import * as NFTMintSubscriber from '../../subscriber/NFTMintSubscriber';
import * as ArtifactDao from '../../dao/ArtifactDao';
import {of} from "rxjs";
import {catchError} from "rxjs/operators";
import * as BlockChainHandler from '../../utils/BlockchainHandler';

import logger from '../../utils/log/Logger';

const tag = 'NFT_MINT_EVENT_SERVICE';

export function subscribeNFTMintEvent(){
    let subscriber = NFTMintSubscriber.getNFTMintSubscriber();

    subscriber
        .pipe(
            catchError(err => {
                if(err.name != process.env.KAFKA_ECONNREFUSED){
                    BlockChainHandler.nftMintEmitter.emit('nftmint', -1);
                    BlockChainHandler.nftMintErrorEmitter.emit('nftminterror');

                    logger.error(`${tag} : Error while receiving object - ${err}`);
                } else 
                    logger.error(`${tag} : ${err}`);

                return of(-1);
            })
        )
        .subscribe((transferObject) => {
            if(transferObject != -1) {
                try {
                    let blockNumber = transferObject.blockNumber;
                    let nft = transferObject.nft;
                    let tx = transferObject.tx;
                    let tokenId  = transferObject.tokenId;
                    let artifactType = BlockChainHandler.typeMapping[transferObject.artifactType];
                    let rarity = BlockChainHandler.rarityMapping[transferObject.artifactRarity];

                    let topic = process.env.KAFKA_TOPIC_ARTIFACT_MINT;

                    logger.info(`${tag} : ${topic} event received : ${JSON.stringify(transferObject)}`);

                    let artifactObject = {
                        tokenId: tokenId,
                        name: `Artifact ${tokenId}`,
                        description: `${rarity} ${artifactType} artifact`,
                        artifactType: artifactType,
                        rarity: rarity
                    }

                    ArtifactDao.createArtifact(artifactObject).then(artifact => BlockChainHandler.nftMintEmitter.emit('nftmint', artifact));
                } catch (err) {
                    BlockChainHandler.nftMintEmitter.emit('nftmint', -1);
                    logger.error(`${tag} : Error while processing object - ${err}`);
                }
            }
        });
}