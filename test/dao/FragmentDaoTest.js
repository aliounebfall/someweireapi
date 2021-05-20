import chai from "chai";
import * as fragmentDao from '../../src/dao/FragmentDao';
import {getFragmentFromNode} from '../../src/utils/FragmentHandler';

import {getDb} from '../../src/dao/Dao';


describe("test fragmentDao Get", ()=>{
    it("should find all fragments", async () =>{
        //Given
        const numFragments = 3;
        //When
        const allFragments = await fragmentDao.getAllFragments();
        //Then
        chai.assert.strictEqual(allFragments.length, numFragments);

        allFragments.forEach(fragment => console.log(fragment.toString()));
    });
});

describe("test fragmentDao Set", ()=>{
    it("should find all fragments", async () =>{
        //Given
        const fragmentId = 4;
        const obtained = 3;

        const fragmentNode = await getDb().findById('Fragment', fragmentId);
        const fragment = getFragmentFromNode(fragmentNode);
        //When
        await fragmentDao.updateFragmentObtained(fragment, obtained);
        //Then
        chai.assert.strictEqual(fragment.getObtained(), obtained);
        console.log(fragment.toString());
    });
});