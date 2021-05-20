import {getDb} from '../../src/dao/Dao';
import * as artifactDao from '../../src/dao/ArtifactDao';
import {getArtifactFromNode} from '../../src/utils/ArtifactHandler';
import chai from "chai";

describe("test artifactDao Get", ()=>{
    it("should find all artifacts", async () =>{
        //Given
        const numArtifacts = 15;
        //When
        const allartifacts = await artifactDao.getAllArtifacts();
        //Then
        chai.assert.strictEqual(allartifacts.length, numArtifacts);

        allartifacts.forEach(artifact => console.log(artifact.toString()));
    });

    it("should find an artifact by tokenId", async () =>{
        //Given
        const tokenId = 15;
        //When
        const result = await artifactDao.getArtifactByTokenId(tokenId);
        //Then
        chai.assert.strictEqual(result.getTokenId(), tokenId);

        console.log(result.toString());
    });
});

describe("test artifactDao create", ()=>{
    it("should create a new artifact", async () =>{
        //Given
        const artifactObject = {
            tokenId:4,
            name:'Artifact 4', 
            description:'Legendary Art artifact 4', 
            artifactType: 'Art',
            rarity: 'Legendary'
        };
        //When
        const artifact = await artifactDao.createArtifact(artifactObject);
        //Then
        chai.assert.strictEqual(artifact.getName(), artifactObject.name);

        console.log(artifact.toString());
    });
});

describe("test playerDao Update Artifact", ()=>{
    it("should update an artifact", async () =>{
        //Given
        const artifactId = 11;
        const artifactNode = await getDb().findById('Artifact', artifactId);
        const artifact = getArtifactFromNode(artifactNode);

        const artifactObject = {
            name:'Toto Item', 
            description:'Legendary Toto Item'
        };
        console.log('before : ' + artifact.toString());

        //When
        await artifactDao.updateArtifact(artifact, artifactObject);

        //Then
        chai.assert.strictEqual(artifact.getName(), artifactObject.name);

        console.log('after : ' + artifact.toString());
    });
});