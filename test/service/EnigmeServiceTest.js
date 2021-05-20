import sinon from 'sinon';
import chai from "chai";
import * as enigmeDao from '../../src/dao/EnigmeDao';
import * as playerDao from '../../src/dao/PlayerDao';
import Player from '../../src/model/classes/PlayerClass';
import Enigme from '../../src/model/classes/EnigmeClass';
import Fragment from '../../src/model/classes/FragmentClass';
import RewardsFragment from '../../src/model/classes/RewardsFragmentClass';
import * as PlayerHandler from '../../src/utils/PlayerHandler'
import {tokenMintEmitter} from '../../src/utils/BlockchainHandler';

import * as enigmeService from '../../src/service/EnigmeService';
import * as web3TokenService from '../../src/service/web3/Web3TokenService';

let player1Updated;

describe("test enigmeService", ()=>{
    before(()=> {
        let enigme1 = new Enigme(0, 1, 'Enigme 1', 'Solution 1', null);
        let enigme2 = new Enigme(1, 2, 'Enigme 2', 'Solution 2', null);
        let enigme3 = new Enigme(2, 3, 'Enigme 3', 'Solution 3', null);
        let player1 = new Player(9, 'Sumanguru', 'Arch Wizard', '0x7A34D4fcfFE080435703AA0F080DE69193aB828f', null);
        player1Updated = new Player(9, 'Sumanguru', 'Arch Wizard', '0x7A34D4fcfFE080435703AA0F080DE69193aB828f', null);

        let fragment1 = new Fragment(3, 'Weivellite', 5, null);
        enigme1.addFragment(fragment1, new RewardsFragment(5));

        player1Updated.addEnigme(enigme1);

        let returnObject = {
            address: player1.getUserAddress(),
            quantite: fragment1.getObtained()
        }

        const enigmesCollection = [enigme1, enigme2, enigme3];

        sinon.stub(playerDao, 'getPlayerByName').resolves(player1);
        sinon.stub(enigmeDao, 'getAllEnigmes').resolves(enigmesCollection);
        sinon.stub(enigmeDao, 'getEnigmeByNumero').resolves(enigme1);
        sinon.stub(playerDao, 'addSolvedEnigmeToPlayer').callsFake((player, enigme)=> {
                player.addEnigme(enigme);
        });

        sinon.stub(web3TokenService, 'mintFragment').resolves(returnObject);
    });


    it("should find all enigmes", async () =>{
        //Given
        const numEnigme = 3;
        //When
        const result = await enigmeService.getEnigmeList();
        //Then
        chai.assert.notStrictEqual(result, -1);
        chai.assert.strictEqual(result.length, numEnigme);

        result.forEach(enigme => console.log(enigme.toString()));
    });

    it("should find one enigme by numero", async () =>{
        //Given
        const enigmeNumero = 1;
        //When
        const result = await enigmeService.getEnigmeByNumero(enigmeNumero);
        //Then
        chai.assert.notStrictEqual(result, -1);
        chai.assert.strictEqual(result.getNumero(), enigmeNumero);

        console.log(result.toString());
    });

    it("should try wrong answer to enigme", async () =>{
        //Given
        const enigmeNumero = 1;
        const playerName = 'Sumanguru';
        const solution = 'Solution null';
        //When
        const result = await enigmeService.trySolveEnigme(playerName, enigmeNumero, solution);
        //Then
        chai.assert.notStrictEqual(result, -1);
        chai.assert.isFalse(PlayerHandler.hasEnigmeByNumero(result, enigmeNumero));

        console.log(result.toString());
    });

    it("should try right answer to enigme", async () =>{
        //Given
        const enigmeNumero = 1;
        const playerName = 'Sumanguru';
        const solution = 'solution 1';

        setTimeout(() => {
            tokenMintEmitter.emit('tokenmint', player1Updated);
        }, 10000);

        //When
        const result = await enigmeService.trySolveEnigme(playerName, enigmeNumero, solution);
        //Then
        chai.assert.notStrictEqual(result, -1);
        chai.assert.isTrue(PlayerHandler.hasEnigmeByNumero(result, enigmeNumero));

        console.log(result.toString());
    });
});