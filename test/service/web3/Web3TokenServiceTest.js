import chai from "chai";
import Player from '../../../src/model/classes/PlayerClass';
import Fragment from '../../../src/model/classes/FragmentClass';
import * as web3TokenService from '../../../src/service/web3/Web3TokenService';

var player1, fragment1;

describe("test web3TokenService", ()=>{
    before(()=> {
        player1 = new Player(9, 'Sumanguru', 'Arch Wizard', '0x7A34D4fcfFE080435703AA0F080DE69193aB828f', null);
        fragment1 = new Fragment(3, 'Weivellite', 5, null);
    });

    it("should find mint fragment and transfer to player", async () =>{
        //Given
        //When
        const result = await web3TokenService.mintFragment(player1, fragment1);
        //Then
        chai.assert.strictEqual(result.quantite, fragment1.getQuantite());
        chai.assert.strictEqual(result.address, player1.getUserAddress());
        console.log(result);
    });

    it("should find balance of player", async () =>{
        //Given
        //When
        const result = await web3TokenService.getBalanceOf(player1, fragment1.getType());
        //Then
        chai.assert.isNumber(result);
        console.log(result);
    });

    it("should find total supply of type", async () =>{
        //Given
        //When
        const result = await web3TokenService.getTotalSupplyOfType(fragment1.getType());
        //Then
        chai.assert.isNumber(result);
        console.log(result);
    });

    it("should find symbol of type", async () =>{
        //Given
        //When
        const result = await web3TokenService.getSymbolOfType(fragment1.getType());
        //Then
        chai.assert.isString(result);
        console.log(result);
    });
});