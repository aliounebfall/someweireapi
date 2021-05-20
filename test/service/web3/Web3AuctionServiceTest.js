import chai from "chai";
import Player from '../../../src/model/classes/PlayerClass';
import * as web3AuctionService from '../../../src/service/web3/Web3AuctionService';

describe("test web3AuctionService", ()=>{
    it("should create a contract instance", async () =>{
        //Given
        let player1 = new Player(9, 'Sumanguru', 'Arch Wizard', '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0', null);
        let timeInSeconds = 60 * 5;
        let startingBid = {amountWeivellite: 1, amountWeither: 0, amountWeillenium: 0}
        let tokenId = 29;
        //When
        const result = await web3AuctionService.createAuction(player1, timeInSeconds, startingBid, tokenId);
        //Then
        chai.assert.isNotNull(result.address);
        console.log(result);
    });
});