import {getDb} from './Dao';
import { getArtifactFromNode } from '../utils/ArtifactHandler';

const db = getDb();

export async function getAllArtifacts() {
    const artifactsCollection = [];
    const result = await db.all('Artifact');

    result.forEach((node) => {
        artifactsCollection.push(getArtifactFromNode(node));
    });

    return artifactsCollection;
}

export async function getArtifactByName(name) {
    const artifactNode = await db.first('Artifact', {name: name});

    if(artifactNode != false)
        return getArtifactFromNode(artifactNode);
    else 
        return artifactNode;
}

export async function getArtifactById(id) {
    const artifactNode = await db.findById('Artifact', id);

    if(artifactNode != false)
        return getArtifactFromNode(artifactNode);
    else 
        return artifactNode;
}

export async function getArtifactByTokenId(tokenId) {
    const artifactNode = await db.first('Artifact', {tokenId: tokenId});

    if(artifactNode != false)
        return getArtifactFromNode(artifactNode);
    else 
        return artifactNode;
}

export async function createArtifact(newArtifact) {
    const artifactNode = await db.create('Artifact', newArtifact);

    return getArtifactFromNode(artifactNode);
}

export async function updateArtifact(artifact, artifactObject) {
    let node = await artifact.getNode().update(artifactObject);

    artifact.setName(node.get('name'));
    artifact.setDescription(node.get('description'));

    return artifact;
}