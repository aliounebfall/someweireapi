import chai from "chai";
import sinon from 'sinon';

import * as playerService from '../../src/service/PlayerService';
import {app, url} from '../../app';

import Player from '../../src/model/classes/PlayerClass';

import chaiHttp from 'chai-http';

describe("test playerController Get", ()=>{
    before(()=> {
        let player1 = new Player(9, 'Sumanguru', 'Arch Wizard', null);
        let player2 = new Player(10, 'Toto', 'Peon', null);
        let player3 = new Player(12, 'Tata', 'Peon', null);
        let player4 = new Player(13, 'Titi', 'Peon', null);

        let player5 = new Player(14, 'New Player', 'Peon', null);
        let player6 = new Player(9, 'Sumanguru X', 'Arch Wizard', null);

        const playersCollection = [player1, player2, player3, player4];

        sinon.stub(playerService, 'getAllPlayers').resolves(playersCollection);
        sinon.stub(playerService, 'getPlayer').resolves(player1);
        sinon.stub(playerService, 'getPlayerById').resolves(player1);
        sinon.stub(playerService, 'createPlayer').resolves(player5);
        sinon.stub(playerService, 'updatePlayer').resolves(player6);

        chai.use(chaiHttp);
    });

    it("should find all players", async () =>{
        //Given
        let playerNumber = 4;
        //When
        let response = await chai.request(app).get(url+'/players');
        // Then
        let playerList = response.body;
        chai.assert.strictEqual(playerList.length, playerNumber);
        console.log(playerList);
    });

    it("should find one player by name", async () =>{
        //Given
        let playerName = 'Sumanguru';
        //When
        let response = await chai.request(app).get(url+'/player/name/'+playerName);
        // Then
        let player = response.body;
        chai.assert.strictEqual(player.name, playerName);
        console.log(player);
    });

    it("should find one player by id", async () =>{
        //Given
        let playerId = 9;
        //When
        let response = await chai.request(app).get(url+'/player/id/'+playerId);
        // Then
        let player = response.body;
        chai.assert.strictEqual(player.id, playerId);
        console.log(player);
    });

    it("should update one player by id", async () =>{
        //Given
        let playerId = 9;
        let newName = 'Sumanguru X';
        let newDescription = 'Arch Wizard';
        //When
        let response = await chai
                            .request(app)
                            .put(url+'/player/update/'+playerId)
                            .send({name: newName, description: newDescription});
        // Then
        let player = response.body;
        chai.assert.strictEqual(player.name, newName);
        chai.assert.strictEqual(player.description, newDescription);
        console.log(player);
    });

    it("should create one player", async () =>{
        //Given
        let name = 'New Player';
        let description = 'Peon';
        //When
        let response = await chai
                            .request(app)
                            .post(url+'/player/create')
                            .send({name: name, description: description});
        // Then
        let player = response.body;
        chai.assert.strictEqual(player.name, name);
        chai.assert.strictEqual(player.description, description);
        console.log(player);
    });
});