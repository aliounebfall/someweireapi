// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma abicoder v2;

import './Weivellite.sol';
import './Weither.sol';
import './Weillenium.sol';
import './Artifact.sol';

contract ArtifactAuction {

    Weivellite weivellite;
    Weither weither;
    Weillenium weillenium;
    Artifact artifact;

    struct Amounts {
        uint amountWeivellite;
        uint amountWeither;
        uint amountWeillenium;
    }

    address public beneficiary;

    address public highestBidder;
    Amounts public highestBid;
    uint public tokenPrizeId;
    uint public auctionEndTime;
    bool public ended;

    mapping(address => Amounts) public pendingReturns;

    event HighestBidIncreased(address bidder, Amounts amounts);
    event AuctionEnded(address winner, Amounts amounts, uint tokenId);
    event WithdrawedBid(address bidder, Amounts amounts);

    constructor(address _beneficiary, uint _biddingTime, Amounts memory _startingBid, uint _tokenId, Weivellite wvt, Weither wtr, Weillenium wnm, Artifact art) {
        beneficiary = _beneficiary;
        highestBid = _startingBid;
        highestBidder = beneficiary;
        tokenPrizeId = _tokenId;
        auctionEndTime = block.timestamp + _biddingTime;
        weivellite = wvt;
        weither = wtr;
        weillenium = wnm;
        artifact = art;

        require(art.ownerOf(tokenPrizeId) == beneficiary, "Beneficiary is not the owner of the token prize");
    }

    function bid(Amounts memory newBid) public {
        uint totalBid = newBid.amountWeivellite + newBid.amountWeither + newBid.amountWeillenium;
        uint totalhighestBid = highestBid.amountWeivellite + highestBid.amountWeither + highestBid.amountWeillenium;

        address sender = msg.sender;

        uint weivelliteAllowance = weivellite.allowance(sender, address(this));
        uint weitherAllowance = weither.allowance(sender, address(this));
        uint weilleniumAllowance = weillenium.allowance(sender, address(this));

        require(block.timestamp <= auctionEndTime,"Auction already ended.");
        require(msg.sender != beneficiary, "Beneficiary should not be the caller.");
        require(totalBid > totalhighestBid, "There already is a higher bid.");
        require(weivelliteAllowance >= newBid.amountWeivellite, "Contract not allowed by bidder to transfer enough weivellite.");
        require(weitherAllowance >= newBid.amountWeither, "Contract not allowed by bidder to transfer enough weither.");
        require(weilleniumAllowance >= newBid.amountWeillenium, "Contract not allowed by bidder to transfer enough weillenium.");

        pendingReturns[highestBidder].amountWeivellite += highestBid.amountWeivellite;
        pendingReturns[highestBidder].amountWeither += highestBid.amountWeither;
        pendingReturns[highestBidder].amountWeillenium += highestBid.amountWeillenium;

        highestBidder = msg.sender;
        highestBid = newBid;

        emit HighestBidIncreased(msg.sender, newBid);

        if(newBid.amountWeivellite != 0){
            weivellite.transferFrom(msg.sender, address(this), newBid.amountWeivellite);
        }

        if(newBid.amountWeither != 0) {
            weither.transferFrom(msg.sender, address(this), newBid.amountWeither);
        }

        if(newBid.amountWeillenium != 0){
            weillenium.transferFrom(msg.sender, address(this), newBid.amountWeillenium);
        }
    }

    function withdraw() public {
        uint amountWeivellite = pendingReturns[msg.sender].amountWeivellite;
        uint amountWeither = pendingReturns[msg.sender].amountWeither;
        uint amountWeillenium = pendingReturns[msg.sender].amountWeillenium;
        bool withdrawed;

        if(amountWeivellite != 0){
            pendingReturns[msg.sender].amountWeivellite = 0;
            withdrawed = withdrawed || true;
            weivellite.transfer(msg.sender, amountWeivellite);
        }

        if(amountWeither != 0){
            pendingReturns[msg.sender].amountWeither = 0;
            withdrawed = withdrawed || true;
            weither.transfer(msg.sender, amountWeither);
        }

        if(amountWeillenium != 0){
            pendingReturns[msg.sender].amountWeillenium = 0;
            withdrawed = withdrawed || true;
            weillenium.transfer(msg.sender, amountWeillenium);
        }

        if(withdrawed){
            emit WithdrawedBid(msg.sender, Amounts({amountWeivellite: amountWeivellite, amountWeither: amountWeither, amountWeillenium: amountWeillenium}));
        }
    }

    function end() public {
        require(!ended, "auctionEnd has already been called.");
        require(msg.sender == beneficiary, "Beneficiary is not the caller.");
        require(artifact.getApproved(tokenPrizeId) == address(this), "Contract not approved for token transfer to highest bidder.");
        require(block.timestamp >= auctionEndTime, "Auction not yet ended.");

        ended = true;

        emit AuctionEnded(highestBidder, highestBid, tokenPrizeId);

        if(highestBidder != beneficiary){
            weivellite.transfer(beneficiary, highestBid.amountWeivellite);
            weither.transfer(beneficiary, highestBid.amountWeither);
            weillenium.transfer(beneficiary, highestBid.amountWeillenium);

            artifact.safeTransferFrom(beneficiary, highestBidder, tokenPrizeId);
        }
    }
}