import sinon from 'sinon';
import chai from "chai";
import * as playerDao from '../../src/dao/PlayerDao';
import * as fragmentDao from '../../src/dao/FragmentDao';
import Player from '../../src/model/classes/PlayerClass';
import Fragment from '../../src/model/classes/FragmentClass';
import HasFragment from '../../src/model/classes/hasFragmentClass';
import * as playerService from '../../src/service/PlayerService';

describe("test playerService", ()=>{
    before(()=> {
        let player1 = new Player(9, 'Sumanguru', 'Arch Wizard', '0x7A34D4fcfFE080435703AA0F080DE69193aB828f', null);
        let player2 = new Player(10, 'Toto', 'Peon', '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b', null);
        let player3 = new Player(12, 'Tata', 'Peon', '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b', null);
        let player4 = new Player(13, 'Titi', 'Peon', null);

        let weivellite = new Fragment(4, 'Weivellite', 0);
        let weither = new Fragment(5, 'Weither', 0);
        let weillenium = new Fragment(6, 'Weillenium', 0);

        let allFragments = [weivellite, weither, weillenium];

        const playersCollection = [player1, player2, player3, player4];

        sinon.stub(playerDao, 'getAllPlayers').resolves(playersCollection);
        sinon.stub(playerDao, 'getPlayerByName').resolves(player1);
        sinon.stub(playerDao, 'getPlayerById').resolves(player1);
        sinon.stub(playerDao, 'createPlayer').resolves(player3);

        sinon.stub(fragmentDao, 'getAllFragments').resolves(allFragments);

        sinon.stub(playerDao, 'updatePlayer').callsFake((player, playerObject)=> {
            player.setName(playerObject.name);
            player.setDescription(playerObject.description);
            player.setUserAddress(playerObject.userAddress);
        });

        sinon.stub(playerDao, 'addFragmentToPlayer').callsFake((player, fragment, has)=> {
            player.addFragment(fragment, new HasFragment(has, null));
        });
    });

    it("should find all players", async () =>{
        //Given
        const numPlayer = 4;
        //When
        const result = await playerService.getAllPlayers();
        //Then
        chai.assert.notStrictEqual(result, -1);
        chai.assert.strictEqual(result.length, numPlayer);
    });

    it("should find one player", async () =>{
        //Given
        const playerName = 'Sumanguru';
        //When
        const result = await playerService.getPlayer(playerName);
        //Then
        chai.assert.notStrictEqual(result, -1);
        chai.assert.strictEqual(result.getName(), playerName);
    });

    it("should update player", async () =>{
        //Given
        const playerId = 9;
        const playerObject = {name: 'Tata', 
                                description: 'Peon', 
                                userAddress: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b'};

        //When
        const result = await playerService.updatePlayer(playerId, playerObject);
        //Then
        chai.assert.notStrictEqual(result, -1);
        chai.assert.strictEqual(result.getName(), playerObject.name);
        console.log(result.toString());
    });


    it("should create player", async () =>{
        //Given
        const playerObject = {name: 'Tata', 
                                description: 'Peon', 
                                userAddress: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b'};
        //When
        const result = await playerService.createPlayer(playerObject);
        //Then
        chai.assert.notStrictEqual(result, -1);
        chai.assert.strictEqual(result.getName(), playerObject.name);
        console.log(result.toString());

    });
});