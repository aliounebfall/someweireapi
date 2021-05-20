// const { assert } = require("chai");

// const AuctionContract = artifacts.require("ArtifactAuction");
// const WeivelliteContract = artifacts.require("Weivellite");
// const WeitherContract = artifacts.require("Weither");
// const WeilleniumContract = artifacts.require("Weillenium");
// const ArtifactContract = artifacts.require("Artifact");


// contract("ArtifactAuction", accounts => {

//     before(async ()=> {
//        auction = await AuctionContract.deployed();
//        wvt = await WeivelliteContract.deployed();
//        wtr = await WeitherContract.deployed();
//        wnm = await WeilleniumContract.deployed();
//        art = await ArtifactContract.deployed();
//     });

//     it("Should get auction beneficiary", async () => {
//         //Given
//         let beneficiary = accounts[1];
//         //When
//         const result = await debug(auction.beneficiary());
//         //Then
//         assert.strictEqual(beneficiary, result);
//         console.log(result);
//     });

//     it("Should get highest current bid", async () => {
//         //Given
//         let startingBid = {amountWeivellite: 1, amountWeither: 1, amountWeillenium: 1};
//         //When
//         const result = await debug(auction.highestBid());
//         //Then
//         assert.strictEqual(startingBid.amountWeivellite, parseInt(result.amountWeivellite));
//         assert.strictEqual(startingBid.amountWeither, parseInt(result.amountWeither));
//         assert.strictEqual(startingBid.amountWeillenium, parseInt(result.amountWeillenium));
//         console.log(result);
//     });

//     it("Should get token prize id", async () => {
//         //Given
//         let tokenPrizeId = 25;
//         //When
//         const result = await debug(auction.tokenPrizeId());
//         //Then
//         assert.strictEqual(parseInt(result), tokenPrizeId);
//         console.log(result);
//     });

//     it("Should get auction end time", async () => {
//         //Given
//         //When
//         const result = await debug(auction.auctionEndTime());
//         //Then
//         assert.isNumber(parseInt(result));
//         assert.notEqual(parseInt(result), 0);
//         console.log(parseInt(result));
//     });

//     it("Should send a new Bid", async () => {
//         //Given
//         let newBid = {amountWeivellite: 0, amountWeither: 1, amountWeillenium: 1};
//         await wvt.approve(auction.address, newBid.amountWeivellite, {from: accounts[3]});
//         await wtr.approve(auction.address, newBid.amountWeither, {from: accounts[3]});
//         await wnm.approve(auction.address, newBid.amountWeillenium, {from: accounts[3]});
//         //When
//         // const result = await debug(auction.bid(newBid, {from: accounts[3]}));
//         const result = await auction.bid(newBid, {from: accounts[3]});
//         //Then
//         assert.strictEqual(newBid.amountWeivellite, parseInt(result.logs[0].args.amounts.amountWeivellite));
//         assert.strictEqual(newBid.amountWeither, parseInt(result.logs[0].args.amounts.amountWeither));
//         assert.strictEqual(newBid.amountWeillenium, parseInt(result.logs[0].args.amounts.amountWeillenium));
//         console.log(result.logs[0].args);
//     });

//     it("Should send another new Bid", async () => {
//         //Given
//         let newBid = {amountWeivellite: 3, amountWeither: 0, amountWeillenium: 0};
//         await wvt.approve(auction.address, newBid.amountWeivellite, {from: accounts[2]});
//         await wtr.approve(auction.address, newBid.amountWeither, {from: accounts[2]});
//         await wnm.approve(auction.address, newBid.amountWeillenium, {from: accounts[2]});
//         //When
//         // const result = await debug(auction.bid(newBid, {from: accounts[2]}));
//         const result = await auction.bid(newBid, {from: accounts[2]});
//         //Then
//         assert.strictEqual(newBid.amountWeivellite, parseInt(result.logs[0].args.amounts.amountWeivellite));
//         assert.strictEqual(newBid.amountWeither, parseInt(result.logs[0].args.amounts.amountWeither));
//         assert.strictEqual(newBid.amountWeillenium, parseInt(result.logs[0].args.amounts.amountWeillenium));
//         console.log(result.logs[0].args);
//     });

//     it("Should withdraw Bid", async () => {
//         //Given
//         let bid = {amountWeivellite: 0, amountWeither: 1, amountWeillenium: 1};
//         //When
//         // const result = await debug(auction.withdraw({from: accounts[2]}));
//         const result = await auction.withdraw({from: accounts[3]});
//         //Then
//         assert.strictEqual(bid.amountWeivellite, parseInt(result.logs[0].args.amounts.amountWeivellite));
//         assert.strictEqual(bid.amountWeither, parseInt(result.logs[0].args.amounts.amountWeither));
//         assert.strictEqual(bid.amountWeillenium, parseInt(result.logs[0].args.amounts.amountWeillenium));
//         console.log(result.logs[0].args);
//     });

//     it("Should end Auction", async () => {
//         //Given
//         let tokenPrizeId = 28;
//         await art.approve(auction.address, tokenPrizeId, {from: accounts[1]});
//         //When
//         // const result = await debug(auction.end({from: accounts[1]}));
//         const result = await auction.end({from: accounts[1]});
//         //Then
//         assert.strictEqual(tokenPrizeId, parseInt(result.logs[0].args.tokenId));
//         console.log(result.logs[0].args);
//     });

//     it("Should get overriden bids", async () => {
//         //Given
//         let beneficiary = '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0';
//         let startingBid = {amountWeivellite: 1, amountWeither: 1, amountWeillenium: 1};
//         //When
//         const result = await debug(auction.pendingReturns(beneficiary));
//         //Then
//         assert.strictEqual(result.amountWeivellite, startingBid.amountWeivellite);
//         assert.strictEqual(result.amountWeither, startingBid.amountWeither);
//         assert.strictEqual(result.amountWeillenium, startingBid.amountWeillenium);
//         console.log(result);
//     });
// });