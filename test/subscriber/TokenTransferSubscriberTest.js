import chai from 'chai';

import * as TokenTransferSubscriber from '../../src/subscriber/TokenTransferSubscriber';

describe("test tokenTransferSubscriber", ()=>{
    it("should subscribe to a token transfer", async () =>{
        //Given
        let address = process.env.ETH_WEIVELLITE_ERC20;
        //When
        const subscriber = TokenTransferSubscriber.getTokenTransferSubscriber(address);
        //Then
        subscriber.subscribe(result => {
            chai.assert.strictEqual(result.token, address);
            console.log(result);
        });
    });
});