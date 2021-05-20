import chai from "chai";
import Player from '../../../src/model/classes/PlayerClass';
import * as web3NFTService from '../../../src/service/web3/Web3NFTService';

let player1;

describe("test web3NFTService", ()=>{
    before(()=> {
        player1 = new Player(9, 'Sumanguru', 'Arch Wizard', '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0', null);
    });

    it("should find symbol of type", async () =>{
        //Given
        //When
        const result = await web3NFTService.getSymbol();
        //Then
        chai.assert.isString(result);
        console.log(result);
    });

    it("should get all artifacts", async () =>{
        //Given
        //When
        const result = await web3NFTService.getAllArtifacts();
        //Then
        chai.assert.isNotEmpty(result);
        console.log(result);
    });

    it("should get artifact by id", async () =>{
        //Given
        let tokenId = 27;
        //When
        const result = await web3NFTService.getArtifact(tokenId);
        //Then
        chai.assert.isString(result.artifactType);
        chai.assert.isString(result.rarity);
        console.log(result);
    });

    it("should mint an artifact", async () =>{
        //Given
        let amounts = {
            amountWeivellite: 0,
            amountWeither: 0,
            amountWeillenium: 2
        }
        //When
        const result = await web3NFTService.mintArtifact(player1, amounts);
        //Then
        chai.assert.strictEqual(result.address, player1.getUserAddress());
        chai.assert.isString(result.artifactType);
        chai.assert.isString(result.rarity);
        chai.assert.isNumber(result.tokenId);
        console.log(result);
    });

    it("should get player's balance", async () =>{
        //Given
        // let balance = 5;
        //When
        const result = await web3NFTService.getBalanceOf(player1);
        //Then
        chai.assert.isNumber(result);
        // chai.assert.strictEqual(result, balance);
        console.log(result);
    });

    it("should find token owner", async () =>{
        //Given
        let tokenId = 4;
        //When
        const result = await web3NFTService.ownerOf(tokenId);
        //Then
        chai.assert.isString(result);
        chai.assert.strictEqual(result, player1.getUserAddress());
        console.log(result);
    });
});