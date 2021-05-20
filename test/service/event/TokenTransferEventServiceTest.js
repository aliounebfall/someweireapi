import sinon from 'sinon';
import chai from "chai";
import _ from "lodash";
import {from} from "rxjs";

import Player from '../../../src/model/classes/PlayerClass';
import Fragment from '../../../src/model/classes/FragmentClass';
import * as PlayerDao from '../../../src/dao/PlayerDao';
import * as FragmentDao from '../../../src/dao/FragmentDao';
import HasFragment from '../../../src/model/classes/hasFragmentClass';

import * as PlayerHandler from '../../../src/utils/PlayerHandler';

import * as TokenTransferSubscriber from '../../../src/subscriber/TokenTransferSubscriber';
import * as EventService from '../../../src/service/event/TokenTransferEventService';

let transferObjectFromMint = {
    blockNumber: 51,
    token: process.env.ETH_WEIVELLITE_ERC20,
    tx: '0x6647803065952fc94807849ee208d658e64e8c421cff7098364e8c9892ff825c',
    from: '0x0000000000000000000000000000000000000000',
    to: '0x7a34d4fcffe080435703aa0f080de69193ab828f',
    amount: 5
};

let transferObjectFromBurn = {
    blockNumber: 51,
    token: process.env.ETH_WEIVELLITE_ERC20,
    tx: '0x6647803065952fc94807849ee208d658e64e8c421cff7098364e8c9892ff825c',
    from: '0x7a34d4fcffe080435703aa0f080de69193ab828f',
    to: '0x0000000000000000000000000000000000000000' ,
    amount: 5
};

let transferObjectFromTransfer = {
    blockNumber: 52,
    token: process.env.ETH_WEIVELLITE_ERC20,
    tx: '0x6647803065952fc94807849ee208d658e64e8c421cff7098364e8c9892ff825c',
    from: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
    to: '0x7a34d4fcffe080435703aa0f080de69193ab828f',
    amount: 5
};

describe("test eventService", ()=>{
    before(()=> {
        let player1 = new Player(9, 'Sumanguru', 'Arch Wizard', '0x7A34D4fcfFE080435703AA0F080DE69193aB828f', null);
        let player2 = new Player(10, 'Toto', 'Peon', '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b', null);

        let fragment1 = new Fragment(3, 'Weivellite', 10, null);

        player1.addFragment(fragment1, new HasFragment(5, null));

        player2.addFragment(fragment1, new HasFragment(5, null));

        sinon.stub(PlayerDao, 'getPlayerByUserAddress')
                .withArgs(transferObjectFromMint.to).resolves(player1)
                .withArgs(transferObjectFromTransfer.from).resolves(player2);

        sinon.stub(PlayerDao, 'updateHasFragmentToPlayer').callsFake((player, fragmentId, has)=> {
            return new Promise((resolve, reject) => {
                PlayerHandler
                .getHasFragment(player, fragmentId)
                .setHas(has);

                resolve(player);
            });
        });

        sinon.stub(FragmentDao, 'updateFragmentObtained').callsFake((fragment, obtained)=> {
            return new Promise((resolve, reject) => {
                fragment.setObtained(obtained);
                resolve(fragment);
            });
        });
    });

    it("should update state from mint object received", () =>{
        //Given
        let address = process.env.ETH_WEIVELLITE_ERC20;
        sinon.stub(TokenTransferSubscriber, 'getTokenTransferSubscriber')
            .callsFake((tokenAddress) => {
                let observable = from([transferObjectFromMint]);
                return observable;
            });
        //When
        EventService.subscribeTokenTransferEvent(address);
        //Then
    });

    it("should update state from burn object received", () =>{
        //Given
        let address = process.env.ETH_WEIVELLITE_ERC20;
        sinon.stub(TokenTransferSubscriber, 'getTokenTransferSubscriber')
            .callsFake((tokenAddress) => {
                let observable = from([transferObjectFromBurn]);
                return observable;
            });
        //When
        EventService.subscribeTokenTransferEvent(address);
        //Then
    });

    it("should update state from regular transfer object received", () =>{
        //Given
        let address = process.env.ETH_WEIVELLITE_ERC20;
        sinon.stub(TokenTransferSubscriber, 'getTokenTransferSubscriber')
            .callsFake(tokenAddress => {
                let observable = from([transferObjectFromTransfer]);
                return observable;
            });
        //When
        let result = EventService.subscribeTokenTransferEvent(address);
        //Then
    });
});