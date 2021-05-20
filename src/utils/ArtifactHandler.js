import Artifact from '../model/classes/ArtifactClass.js';

export function getArtifactFromNode(node) {
    return new Artifact(
        node.identity().toInt(),
        node.get('tokenId').toInt(),
        node.get('name'), 
        node.get('description'),
        node.get('artifactType'), 
        node.get('rarity'),
        node); 
}