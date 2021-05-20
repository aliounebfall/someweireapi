import chai from "chai";
import * as SyncService from '../../../src/service/sync/SyncService';

let player1;

describe("test sync service", ()=>{

    it("should sync", async () =>{
        //Given
        let playerName = 'Sumanguru';
        //When
        const result = await SyncService.sync(playerName);
        //Then
        chai.assert.strictEqual(result.getName(), playerName);
        console.log(result.toString());
    });
});