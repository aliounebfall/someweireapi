import chai from 'chai';

import * as NFTMintSubscriber from '../../src/subscriber/NFTMintSubscriber';

describe("test nftMintSubscriber", ()=>{
    it("should subscribe to a nft mint", async () =>{
        //Given
        let address = process.env.ETH_ARTIFACT_ERC721;
        //When
        const subscriber = NFTMintSubscriber.getNFTMintSubscriber(address);
        //Then
        subscriber.subscribe(result => {
            chai.assert.strictEqual(result.nft, address);
            console.log(result);
        });
    });
});