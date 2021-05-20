import chai from "chai";
import sinon from 'sinon';

import * as marketService from '../../src/service/MarketService';

import {app, url} from '../../app';

import Player from '../../src/model/classes/PlayerClass';
import Artifact from '../../src/model/classes/ArtifactClass';

import HasArtifact from '../../src/model/classes/hasArtifactClass';
import BidArtifact from '../../src/model/classes/bidArtifactClass';

import chaiHttp from 'chai-http';

describe("test marketController Get", ()=>{
    before(()=> {
        let artifact1 = new Artifact(6, 'Artifact 1', 'Legendary Artifact 1', 1, 1, 1, null);
        let artifact2 = new Artifact(7, 'Artifact 2', 'Legendary Artifact 2', 1, 1, 1, null);
        let artifact3 = new Artifact(8, 'Artifact 3', 'Legendary Artifact 3', 1, 1, 1, null);
        let artifact4 = new Artifact(11, 'Artifact 4', 'Legendary Artifact 4', 2, 2, 2, null);

        let player1 = new Player(9, 'Sumanguru', 'Arch Wizard', null);
        let player1_2 = new Player(9, 'Sumanguru', 'Arch Wizard', null);
        let player1_3 = new Player(9, 'Sumanguru', 'Arch Wizard', null);

        let hasArtifact1 = new HasArtifact(true, null);
        let hasArtifact4 = new HasArtifact(false, null);

        let bidArtifact3 = new BidArtifact(4, 4, 4, null);
        let bidArtifact3_2 = new BidArtifact(5, 5, 5, null);

        const artifactsCollection = [artifact1, artifact2, artifact3];

        player1.addArtifact(artifact1, hasArtifact1);
        player1.addArtifact(artifact4, hasArtifact4);

        player1_3.addArtifact(artifact1, hasArtifact1);
        player1_3.addArtifact(artifact4, hasArtifact4);

        player1.addBidArtifact(artifact3, bidArtifact3);
        // player2.addArtifact(artifact3, hasArtifact3);

        player1_2.addBidArtifact(artifact3, bidArtifact3_2);

        sinon.stub(marketService, 'getArtifactList').resolves(artifactsCollection);
        sinon.stub(marketService, 'getArtifactById')
                        .withArgs(artifact1.getId()).resolves(artifact1)
                        .withArgs(artifact2.getId()).resolves(artifact2)
                        .withArgs(artifact3.getId()).resolves(artifact3);
        sinon.stub(marketService, 'createArtifact').resolves(player1);
        sinon.stub(marketService, 'updateSellingPlayerArtifact').resolves(player1);
        sinon.stub(marketService, 'placeArtifactBidForPlayer').resolves(player1);
        sinon.stub(marketService, 'updateArtifactBidForPlayer').resolves(player1_2);
        sinon.stub(marketService, 'removeArtifactBidForPlayer').resolves(player1_3);

        chai.use(chaiHttp);
    });

    it("should find all artifacts", async () =>{
        //Given
        let artifactsNumber = 3;
        //When
        let response = await chai.request(app).get(url+'/artifacts');
        // Then
        let artifactList = response.body;
        chai.assert.strictEqual(artifactList.length, artifactsNumber);
        console.log(artifactList);
    });

    it("should find one artifact by id", async () =>{
        //Given
        let artifactId = 6;
        //When
        let response = await chai.request(app).get(url+'/artifact/'+artifactId);
        // Then
        let artifact = response.body;
        chai.assert.strictEqual(artifact.id, artifactId);
        console.log(artifact);
    });

    it("should create one artifact for player", async () =>{
        //Given
        let playerName = 'Sumanguru';
        const artifactObject = {
            name:'Artifact 4', 
            description:'Legendary Artifact 4', 
            priceWeivellite: 2, 
            priceWeither: 2,
            priceWeillenium: 2
        };
        //When
        let response = await chai
                            .request(app)
                            .put(url+'/artifact/create/'+playerName)
                            .send(artifactObject);
        // Then
        let player = response.body;
        chai.assert.isTrue(player.artifacts.some(artifact => artifact.name == artifactObject.name));
        console.log(player);
    });

    it("should update one artifact for player", async () =>{
        //Given
        let playerName = 'Sumanguru';
        let selling = true;
        let artifactId = 6;
        //When
        let response = await chai
                            .request(app)
                            .put(url+'/artifact/update/selling'+artifactId+'/player/'+playerName)
                            .send({selling: selling});
        // Then
        let player = response.body;
        let artifact = player.artifacts.find(artifact => artifact.id == artifactId);
        chai.assert.isTrue(artifact.selling);
        console.log(player);
    });
});