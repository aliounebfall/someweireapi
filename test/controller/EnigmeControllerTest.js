import chai from "chai";
import sinon from 'sinon';

import * as enigmeService from '../../src/service/EnigmeService';
import {app, url} from '../../app';

import Enigme from '../../src/model/classes/EnigmeClass';
import Player from '../../src/model/classes/PlayerClass';
import Fragment from '../../src/model/classes/FragmentClass';
import HasFragment from '../../src/model/classes/hasFragmentClass';
import * as PlayerHandler from '../../src/utils/PlayerHandler'

import chaiHttp from 'chai-http';

describe("test enigmeController Get", ()=>{

    before(()=> {
        let enigme1 = new Enigme(0, 1, 'Enigme 1', 'Solution 1', null);
        let enigme2 = new Enigme(1, 2, 'Enigme 2', 'Solution 2', null);
        let enigme3 = new Enigme(2, 3, 'Enigme 3', 'Solution 3', null);
        let player1 = new Player(9, 'Sumanguru', 'Arch Wizard', null);
        let fragment1 = new Fragment(3, 'Weivellite', 5, null);
        enigme1.addFragment(fragment1);

        player1.addEnigme(enigme1);
        player1.addFragment(fragment1, new HasFragment(fragment1.getQuantite(), null));

        const enigmesCollection = [enigme1, enigme2, enigme3];
        sinon.stub(enigmeService, 'getEnigmeList').resolves(enigmesCollection);
        sinon.stub(enigmeService, 'getEnigmeByNumero').withArgs(enigme1.getNumero()).resolves(enigme1);
        sinon.stub(enigmeService, 'trySolveEnigme').resolves(player1);

        chai.use(chaiHttp);
    });

    it("should find all enigmes", async () =>{
        //Given
        let enigmeNum = 3;
        //When
        let response = await chai.request(app).get(url+'/enigmes');
        // Then
        let enigmeList = response.body;
        chai.assert.strictEqual(enigmeList.length, enigmeNum);
        console.log(enigmeList);
    });

    it("should find an enigme by numero", async () =>{
        //Given
        let enigmeNumero = 1;
        //When
        let response = await chai
                            .request(app)
                            .get(url+'/enigme/'+enigmeNumero);
        // Then
        let enigme = response.body;
        chai.assert.strictEqual(enigme.numero, enigmeNumero);
        console.log(enigme);
    });

    it("should find solve an enigme by numero", async () =>{
        //Given
        let enigmeNumero = 1;
        let playerName = 'Sumanguru';
        let solution = 'Solution 1';
        let amount = 5
        //When
        let response = await chai
                            .request(app)
                            .put(url+'/enigme/solve/'+enigmeNumero)
                            .send({playerName: playerName,
                                    solution: solution});
        // Then
        let player = response.body;
        chai.assert.isTrue(player.enigmes.some(enigme => enigme.numero == enigmeNumero));
        chai.assert.strictEqual(PlayerHandler.getHasFragmentByType(player, Weivellite), amount);
        console.log(player);
    });
});