import * as playerDao from '../../src/dao/PlayerDao';
import * as PlayerHandler from '../../src/utils/PlayerHandler';
import {getFragmentFromNode} from '../../src/utils/FragmentHandler';
import {getArtifactFromNode} from '../../src/utils/ArtifactHandler';
import { getEnigmeFromNode } from '../../src/utils/EnigmeHandler';

import {getDb} from '../../src/dao/Dao';
import chai from "chai";

describe("test playerDao Get", ()=>{
    it("should find all players", async () =>{
        //Given
        const numPlayers = 5;
        //When
        const allPlayers = await playerDao.getAllPlayers();
        //Then
        chai.assert.strictEqual(allPlayers.length, numPlayers);

        allPlayers.forEach(player => console.log(player.toString()));
    });

    it("should find one player by Id", async () =>{
        //Given
        const playerId = 9;
        //When
        const player = await playerDao.getPlayerById(playerId);
        //Then
        chai.assert.strictEqual(player.getId(), playerId);

        console.log(player.toString());
    });

    it("should find one player by name", async () =>{
        //Given
        const playerName = 'Toto';
        //When
        const player = await playerDao.getPlayerByName(playerName);
        //Then
        chai.assert.strictEqual(player.getName(), playerName);

        console.log(player.toString());
    });

    it("should find one player by userAddress", async () =>{
        //Given
        const userAddress = '0xffcf8fdee72ac11b5c542428b35eef5769c409f0';
        //When
        const player = await playerDao.getPlayerByUserAddress(userAddress);
        //Then
        chai.assert.strictEqual(player.getUserAddress(), userAddress);

        console.log(player.toString());
    });
});

describe("test playerDao create", ()=>{
    it("should create a new player", async () =>{
        //Given
        const playerObject = {
            name:'Tutu', 
            description:'Peon', 
            userAddress: '0xb0057716d5917badaf911b193b12b910811c1497b5bada8d7711f758981c3773'
        };
        //When
        const player = await playerDao.createPlayer(playerObject);
        //Then
        chai.assert.strictEqual(player.getName(), playerObject.name);

        console.log(player.toString());
    });
});

describe("test playerDao Update player", ()=>{
    it("should update a player", async () =>{
        //Given
        const playerId = 26;
        const playerNode = await getDb().findById('Player', playerId);
        const player = PlayerHandler.getPlayerFromNode(playerNode);

        const playerObject = {
            name:'Tyty', 
            description:'Peon'
        };
        //When
        await playerDao.updatePlayer(player, playerObject);

        //Then
        chai.assert.strictEqual(player.getName(), playerObject.name);

        console.log(player.toString());
    });
});

describe("test playerDao Update relationships", ()=>{
    it("should add a fragment to a player", async () =>{
        //Given
        const playerId = 26;
        const playerNode = await getDb().findById('Player', playerId);
        const player = PlayerHandler.getPlayerFromNode(playerNode);

        const fragmentId = 4;
        const fragmentNode = await getDb().findById('Fragment', fragmentId);
        const fragment = getFragmentFromNode(fragmentNode);

        const has = 0;

        //When
        await playerDao.addFragmentToPlayer(player, fragment, has);
        //Then
        chai.assert.isTrue(PlayerHandler.hasFragment(player, fragmentId));

        console.log(player.toString());
    });

    it("should add an Artifact to a player", async () =>{
        //Given
        const playerId = 26;
        const playerNode = await getDb().findById('Player', playerId);
        const player = PlayerHandler.getPlayerFromNode(playerNode);

        const artifactId = 22;
        const artifactNode = await getDb().findById('Artifact', artifactId);
        const artifact = getArtifactFromNode(artifactNode);

        //When
        await playerDao.addArtifactToPlayer(player, artifact);
        //Then
        chai.assert.isTrue(PlayerHandler.hasArtifact(player, artifactId));

        console.log(player.toString());
    });

    it("should add an Enigme to a player", async () =>{
        //Given
        const playerId = 26;
        const playerNode = await getDb().findById('Player', playerId);
        const player = PlayerHandler.getPlayerFromNode(playerNode);

        const enigmeId = 2;
        const enigmeNode = await getDb().findById('Enigme', enigmeId);
        const enigme = getEnigmeFromNode(enigmeNode);

        //When
        await playerDao.addSolvedEnigmeToPlayer(player, enigme);
        //Then
        chai.assert.isTrue(PlayerHandler.hasEnigme(player, enigmeId));

        console.log(player.toString());
    });

    it("should update left value for a Fragment", async () =>{
        //Given
        const playerId = 26;
        const playerNode = await getDb().findById('Player', playerId);
        const player = PlayerHandler.getPlayerFromNode(playerNode);
        const fragmentId = 4;
        const has = 2;

        //When
        await playerDao.updateHasFragmentToPlayer(player, fragmentId, has);
        //Then
        chai.assert.isTrue(PlayerHandler.getHasFragment(player, fragmentId).getHas() == has);

        console.log(player.toString());
    });

    it("should update selling value for artifact", async () =>{
        //Given
        const playerId = 26;
        const playerNode = await getDb().findById('Player', playerId);
        const player = PlayerHandler.getPlayerFromNode(playerNode);
        const artifactId = 22;
        const selling = true;

        //When
        await playerDao.updateArtifactSoldFromPlayer(player, artifactId, selling);
        //Then
        chai.assert.isTrue(PlayerHandler.getHasArtifact(player, artifactId).getSelling() == selling);

        console.log(player.toString());
    });
});

describe("test playerDao Remove relationships", ()=>{
    it("should remove artifact", async () =>{
        //Given
        const playerId = 9;
        const playerNode = await getDb().findById('Player', playerId);
        const player = PlayerHandler.getPlayerFromNode(playerNode);
        const artifactId = 7;
        const artifactNode = await getDb().findById('Artifact', artifactId);
        const artifact = getArtifactFromNode(artifactNode);
        
        //When
        await playerDao.removeArtifactFromPlayer(player, artifact);
        //Then
        chai.assert.isFalse(PlayerHandler.hasArtifact(player, artifactId));

        console.log(player.toString());
    });
});