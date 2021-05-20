import sinon from 'sinon';
import chai from "chai";
import {from} from "rxjs";
import { first } from 'rxjs/operators';

import * as NFTTransferSubscriber from '../../../src/subscriber/NFTTransferSubscriber';
import * as NFTTransferEventService from '../../../src/service/event/NFTTransferEventService';
import * as PlayerDao from '../../../src/dao/PlayerDao';
import * as ArtifactDao from '../../../src/dao/ArtifactDao';
import Artifact from '../../../src/model/classes/ArtifactClass';
import Player from '../../../src/model/classes/PlayerClass';
import HasArtifact from '../../../src/model/classes/hasArtifactClass';

import {nftTransferObservable} from '../../../src/utils/BlockchainHandler';

let transferObjectFromMint = {
    blockNumber: 51,
    nft: process.env.ETH_ARTIFACT_ERC721,
    tx: '0x6647803065952fc94807849ee208d658e64e8c421cff7098364e8c9892ff825c',
    from: '0x0000000000000000000000000000000000000000',
    to: '0x7a34d4fcffe080435703aa0f080de69193ab828f',
    tokenId: 18
};

let transferObjectFromTransfer = {
    blockNumber: 52,
    nft: process.env.ETH_ARTIFACT_ERC721,
    tx: '0x6647803065952fc94807849ee208d658e64e8c421cff7098364e8c9892ff825c',
    from: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
    to: '0x7a34d4fcffe080435703aa0f080de69193ab828f',
    tokenId: 18
};

describe("test nftTransferEventService", ()=>{
    before(()=> {
        let player1 = new Player(9, 'Sumanguru', 'Arch Wizard', '0x7a34d4fcffe080435703aa0f080de69193ab828f', null);
        let player2 = new Player(10, 'Toto', 'Peon', '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b', null);

        let artifact1 = new Artifact(6, 18, 'Artifact 1', 'Common Artifact 1', 'Art', 'Common', null);
        player2.addArtifact(artifact1, new HasArtifact(true));

        sinon.stub(PlayerDao, 'getPlayerByUserAddress')
            .withArgs(transferObjectFromMint.to).resolves(player1)
            .withArgs(transferObjectFromTransfer.from).resolves(player2);

        sinon.stub(ArtifactDao, 'getArtifactByTokenId').resolves(artifact1);

        sinon.stub(PlayerDao, 'removeArtifactFromPlayer').callsFake((player, artifact)=> {
            return new Promise((resolve, reject) => {
                player.removeArtifact(artifact.getId())
                resolve(player);
            });
        });

        sinon.stub(PlayerDao, 'addArtifactToPlayer').callsFake((player, artifact) => {
            return new Promise((resolve, reject) => {
                player.addArtifact(artifact, new HasArtifact(false));
                resolve(player);
            });
        });
    });

    it("should update state from regular transfer object received", async () =>{
        //Given
        let address = process.env.ETH_ARTIFACT_ERC721;
        sinon.stub(NFTTransferSubscriber, 'getNftTransferSubscriber')
            .callsFake(nftAddress => {
                let observable = from([transferObjectFromTransfer]);
                NFTTransferSubscriber.transferSubscritions.set(nftAddress, observable);
                return observable;
            });
        //When
        let result = NFTTransferEventService.subscribeNFTTransferEvent(address);
        let players = await nftTransferObservable.pipe(first()).toPromise();
        //Then
        chai.assert.isTrue([...result.keys()].some(tokenAdress => address == tokenAdress));
        chai.assert.isNotEmpty(players);
        chai.assert.notEqual(players, -1);
        console.log(players.toString());
    });

    it("should not update state from mint transfer object received", () =>{
        //Given
        let address = process.env.ETH_ARTIFACT_ERC721;
        sinon.stub(NFTTransferSubscriber, 'getNftTransferSubscriber')
            .callsFake(nftAddress => {
                let observable = from([transferObjectFromMint]);
                NFTTransferSubscriber.transferSubscritions.set(nftAddress, observable);
                return observable;
            });
        //When
        let result = NFTTransferEventService.subscribeNFTTransferEvent(address);
        //Then
        chai.assert.isTrue([...result.keys()].some(tokenAdress => address == tokenAdress));
    });
});