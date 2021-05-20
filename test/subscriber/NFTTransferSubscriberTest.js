import chai from 'chai';

import * as NFTTransferSubscriber from '../../src/subscriber/NFTTransferSubscriber';

describe("test nftTransferSubscriber", ()=>{
    it("should subscribe to a nft transfer", async () =>{
        //Given
        let address = process.env.ETH_ARTIFACT_ERC721;
        //When
        const subscriber = NFTTransferSubscriber.getNftTransferSubscriber(address);
        //Then
        subscriber.subscribe(result => {
            chai.assert.strictEqual(result.nft, address);
            console.log(result);
        });
    });
});