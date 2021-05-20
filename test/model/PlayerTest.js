import assert from 'assert';
import Neode from 'neode';
import path from "path";
import chai from "chai";
import chai_string from "chai-string";
import * as PlayerHandler from '../../src/utils/PlayerHandler.js';


const schemaPath= path.join(process.cwd(), 'src', 'model', 'schema');
const db = Neode.fromEnv();

db.withDirectory(schemaPath);

describe("test player model", ()=>{
    it("should find all players", async () =>{
        //Given
        //When
        const result = await db.all('Player');
        //Then
        assert.notStrictEqual(result.length, 0);
        console.log(result);
    });

    it("should find one player", async () =>{
        //Given
        const name="Sumanguru";
        //When
        const result = await db.all('Player', {name : 'Sumanguru'});

        const sumanguru = PlayerHandler.getPlayerFromNode(result.get(0));
        //Then
        assert.strictEqual(sumanguru.getName(), name);
        console.log(sumanguru.toString());
    });
});

describe("test player relationships", () => {
    it("should find relationships", async ()=> {
        //Given
        const artifact2Name="Artifact 39";
        const artifact3Name="Artifact 36";
        const weivellite="Weivellite";
        const enigmeTitle="Enigme 1";

        //When
        const result = await db.all('Player', {name : 'Sumanguru'});

        const sumanguru = PlayerHandler.getPlayerFromNode(result.get(0));

        //Then
        chai.assert.isTrue(
            PlayerHandler.hasArtifactByName(sumanguru, artifact2Name));

        chai.assert.isTrue(
            PlayerHandler.hasArtifactByName(sumanguru, artifact3Name));

        chai.assert.isNumber(
            PlayerHandler.getHasFragmentByType(sumanguru, weivellite).getHas());

        // chai.assert.isTrue(
        //     sumanguru
        //         .getEnigmes()
        //         .some((enigme) => enigme.getTitre() == enigmeTitle));

        console.log(sumanguru.toString());
    });
});