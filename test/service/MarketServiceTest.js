import sinon from 'sinon';
import chai from "chai";
import * as artifactDao from '../../src/dao/ArtifactDao';
import * as playerDao from '../../src/dao/PlayerDao';
import Player from '../../src/model/classes/PlayerClass';
import Artifact from '../../src/model/classes/ArtifactClass';
import HasArtifact from '../../src/model/classes/hasArtifactClass';
import * as PlayerHandler from '../../src/utils/PlayerHandler'
import {nftMintEmitter, typeMapping, rarityMapping} from '../../src/utils/BlockchainHandler';

import * as marketService from '../../src/service/MarketService';
import * as web3NFTService from '../../src/service/web3/Web3NFTService';

let artifact4;

describe("test enigmeService", ()=>{
    before(()=> {
        let artifact1 = new Artifact(6, 15, 'Artifact 1', 'Legendary Artifact 1', 'Art', 'Rare', null);
        let artifact2 = new Artifact(7, 16, 'Artifact 2', 'Legendary Artifact 2', 'Art', 'Rare', null);
        let artifact3 = new Artifact(8, 17, 'Artifact 3', 'Legendary Artifact 3', 'Art', 'Rare', null);
        artifact4 = new Artifact(11, 18, 'Artifact 4', 'Common Art Artifact', 'Art', 'Common', null);

        let player1 = new Player(9, 'Sumanguru', 'Arch Wizard', '0x7A34D4fcfFE080435703AA0F080DE69193aB828f', null);
        let hasArtifact1 = new HasArtifact(false, null);

        player1.addArtifact(artifact1, hasArtifact1);
        
        const artifactsCollection = [artifact1, artifact2, artifact3];

        let mintReturnObject = {
            address : process.env.ETH_ARTIFACT_ERC721,
            tokenId: 18,
            artifactType: typeMapping[1],
            artifactRarity: rarityMapping[0]
        }

        sinon.stub(artifactDao, 'getAllArtifacts').resolves(artifactsCollection);
        sinon.stub(artifactDao, 'getArtifactById')
                        .withArgs(artifact1.getId()).resolves(artifact1)
                        .withArgs(artifact2.getId()).resolves(artifact2)
                        .withArgs(artifact3.getId()).resolves(artifact3);

        sinon.stub(playerDao, 'addArtifactToPlayer').callsFake((player, artifact)=> {
            let hasArtifact = new HasArtifact(false, null);
            player.addArtifact(artifact, hasArtifact);
        });
        sinon.stub(playerDao, 'removeArtifactFromPlayer').callsFake((player, artifactId)=> {
            player.removeArtifact(artifactId);
        });
        sinon.stub(playerDao, 'updateArtifactSoldFromPlayer').callsFake((player, artifactId, selling)=> {
            PlayerHandler.getHasArtifact(player, artifactId).setSelling(selling);
        });

        sinon.stub(playerDao, 'getPlayerByName').withArgs('Sumanguru').resolves(player1);
        sinon.stub(playerDao, 'updateHasFragmentToPlayer').callsFake((player, fragmentId, left)=> {
            PlayerHandler
                .getHasFragment(player, fragmentId)
                .setLeft(left);
        });

        sinon.stub(web3NFTService, 'mintArtifact').resolves(mintReturnObject);

    });


    it("should find all artifacts", async () =>{
        //Given
        const numArtifacts = 3;
        //When
        const result = await marketService.getArtifactList();
        //Then
        chai.assert.notStrictEqual(result, -1);
        chai.assert.strictEqual(result.length, numArtifacts);

        result.forEach(artifact => console.log(artifact.toString()));
    });

    it("should find one artifact", async () =>{
        //Given
        const artifactId = 6;
        //When
        const result = await marketService.getArtifactById(artifactId);
        //Then
        chai.assert.notStrictEqual(result, -1);
        chai.assert.strictEqual(result.getId(), artifactId);

        console.log(result.toString());
    });

    it("should create an artifact", async () =>{
        //Given
        const amounts = { 
            amountWeivellite: 2, 
            amountWeither: 2,
            amountWeillenium: 2
        };
        const playerName = 'Sumanguru';

        setTimeout(() => {
            nftMintEmitter.emit('nftmint', artifact4);
        }, 5000);

        //When
        const result = await marketService.createArtifact(playerName, amounts);
        //Then
        chai.assert.notStrictEqual(result, -1);
        chai.assert.isTrue(PlayerHandler.hasArtifactByName(result, artifact4.getName()));

        console.log(result.toString());
    });

    it("should update has artifact property for player", async () =>{
        //Given
        const playerName = 'Sumanguru';
        const artifactId = 6;
        const selling = true;
        //When
        const result = await marketService.updateSellingPlayerArtifact(playerName, artifactId, selling);
        //Then
        chai.assert.notStrictEqual(result, -1);
        chai.assert.isTrue(PlayerHandler.getHasArtifact(result, artifactId).getSelling());

        console.log(result.toString());
    });
});