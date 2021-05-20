import sinon from 'sinon';
import chai from "chai";
import {from} from "rxjs";
import { first } from 'rxjs/operators';

import * as NFTMintSubscriber from '../../../src/subscriber/NFTMintSubscriber';
import * as NFTMintEventService from '../../../src/service/event/NFTMintEventService';
import {nftMintObservable} from '../../../src/utils/BlockchainHandler';

import * as ArtifactDao from '../../../src/dao/ArtifactDao';
import Artifact from '../../../src/model/classes/ArtifactClass';

let mintObject = {
    blockNumber: 51,
    nft: process.env.ETH_ARTIFACT_ERC721,
    tx: '0x6647803065952fc94807849ee208d658e64e8c421cff7098364e8c9892ff825c',
    tokenId: 18,
    artifactType: 1,
    artifactRarity: 0
};

describe("test nftTransferEventService", ()=>{
    before(()=> {
        let artifact1 = new Artifact(6, 18, 'Artifact 18', 'Common Art Artifact', 'Art', 'Common', null);
        sinon.stub(ArtifactDao, 'createArtifact').resolves(artifact1);
    });

    it("should update state from mint object received", async () =>{
        //Given
        let address = process.env.ETH_ARTIFACT_ERC721;
        sinon.stub(NFTMintSubscriber, 'getNFTMintSubscriber')
            .callsFake(nftAddress => {
                let observable = from([mintObject]);
                NFTMintSubscriber.transferSubscritions.set(nftAddress, observable);
                return observable;
            });
        //When
        let result = NFTMintEventService.subscribeNFTMintEvent(address);
        let artifact = await nftMintObservable.pipe(first()).toPromise();
        //Then
        chai.assert.isTrue([...result.keys()].some(tokenAdress => address == tokenAdress));
        chai.assert.isNotNull(artifact);
        chai.assert.notEqual(artifact, -1);
        console.log(artifact.toString());
    });
});