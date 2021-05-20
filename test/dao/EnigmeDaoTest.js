import {getDb} from '../../src/dao/Dao';
import * as enigmeDao from '../../src/dao/EnigmeDao';
import {getEnigmeFromNode} from '../../src/utils/EnigmeHandler';
import chai from "chai";

describe("test enigmeDao Get", ()=>{
    it("should find all enigmes", async () =>{
        //Given
        const numEnigme = 3;
        //When
        const allEnigmes = await enigmeDao.getAllEnigmes();
        //Then
        chai.assert.strictEqual(allEnigmes.length, numEnigme);

        allEnigmes.forEach(enigme => console.log(enigme.toString()));
    });

    it("should find one enigme by Id", async () =>{
        //Given
        const enigmeId = 1;
        //When
        const enigme = await enigmeDao.getEnigmeById(enigmeId);
        //Then
        chai.assert.strictEqual(enigme.getId(), enigmeId);

        console.log(enigme.toString());
    });

    it("should find one enigme by numero", async () =>{
        //Given
        const enigmeNumero = 1;
        //When
        const enigme = await enigmeDao.getEnigmeByNumero(enigmeNumero);
        //Then
        chai.assert.strictEqual(enigme.getNumero(), enigmeNumero);

        console.log(enigme.toString());
    });
});