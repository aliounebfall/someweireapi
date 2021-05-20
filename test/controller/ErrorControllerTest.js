import chai from "chai";
import sinon from 'sinon';

import {app, url} from '../../app';
import * as playerService from '../../src/service/PlayerService';
import Player from '../../src/model/classes/PlayerClass';


import chaiHttp from 'chai-http';


describe("test errorController Get", ()=>{

    before(()=> {
        let player1 = new Player(9, 'Sumanguru', 'Arch Wizard', null);
        sinon.stub(playerService, 'updatePlayer').resolves(player1);

        chai.use(chaiHttp);
    });

    it("should get error 404", async () =>{
        //Given
        let status = 404;
        //When
        let response = await chai.request(app).get(url+'/toto');
        //Then
        console.log(response.text);
        chai.assert.strictEqual(response.status, status);
    });

    it("should get error 500", async () =>{
        //Given
        let playerId = 9;
        // let playerId = 'toto';
        let status = 500;
        //When
        let response = await chai
                            .request(app)
                            .put(url+'/player/update/'+playerId)
                            .send({name: 'toto', description: 5});

        //Then
        console.log(response.text);
        chai.assert.strictEqual(response.status, status);
    });
});