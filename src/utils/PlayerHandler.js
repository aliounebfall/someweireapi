import Player from '../model/classes/PlayerClass.js';
import HasArtifact from '../model/classes/hasArtifactClass.js';
import HasFragment from '../model/classes/hasFragmentClass.js';
import { getArtifactFromNode } from './ArtifactHandler.js';
import { getAuctionFromNode } from './AuctionHandler.js';
import { getFragmentFromNode } from './FragmentHandler.js';
import { getEnigmeFromNode } from './EnigmeHandler.js';

export function getPlayerFromNode(node) {
    const player = new Player(
        node.identity().toInt(),
        node.get('name'), 
        node.get('description'), 
        node.get('userAddress'), 
        node);

    if(node.get('hasArtifact') != null)
    node
        .get('hasArtifact')
        .forEach((relationship) => {
            const artifact = getArtifactFromNode(relationship.endNode()) ;
            const hasArtifact = new HasArtifact(relationship.get('selling'), relationship);
            player.addArtifact(artifact, hasArtifact);
        });

    if(node.get('created') != null)
        node
            .get('created')
            .forEach((relationship) => {
                const auction = getAuctionFromNode(relationship.endNode());
                player.addAuction(auction);
            });

    if(node.get('hasFragment') != null)
    node
        .get('hasFragment')
        .forEach((relationship) => {
            const fragment = getFragmentFromNode(relationship.endNode());
            let has = 0;

            if(relationship.get('has') != 0)
            has = relationship.get('has').toInt();

            const hasFragment = new HasFragment(has, relationship);

            player.addFragment(fragment, hasFragment);
        });

    if(node.get('solved') != null)
    node
        .get('solved')
        .forEach((relationship) => {
            const enigme = getEnigmeFromNode(relationship.endNode());
            player.addEnigme(enigme);
        });

    return player;
}

export function getFragmentsArray(player) {
    return player
        .getFragments()
        .flatMap(map => map.keys().next().value);
}

export function getFragment(player, fragmentId) {
    return getFragmentsArray(player).find(fragment => fragment.getId() == fragmentId);
}

export function getFragmentByType(player, type) {
    return getFragmentsArray(player).find(fragment => fragment.getType().toLowerCase() == type.toLowerCase());
}

export function getHasFragment(player, fragmentId){
    return player
        .getFragments()
        .find(map => map.keys().next().value.getId() == fragmentId)
        .get(getFragment(player, fragmentId));
}

export function getHasFragmentByType(player, type){
    return player
        .getFragments()
        .find(map => map.keys().next().value.getType().toLowerCase() == type.toLowerCase())
        .get(getFragmentByType(player, type));
}

export function getArtifactsArray(player) {
    return player
        .getArtifacts()
        .flatMap(map => map.keys().next().value);
}

export function hasArtifactByTokenId(player, tokenId) {
    return getArtifactsArray(player).some(artifact => artifact.getTokenId() == tokenId);
}

export function hasArtifactById(player, artifactId) {
    return getArtifactsArray(player).some(artifact => artifact.getId() == artifactId);
}

export function hasArtifactByName(player, artifactName) {
    return getArtifactsArray(player).some(artifact => artifact.getName().toLowerCase() == artifactName.toLowerCase());
}

export function getArtifact(player, artifactId) {
    return getArtifactsArray(player).find(artifact => artifact.getId() == artifactId);
}

export function getHasArtifact(player, artifactId){
    return player
        .getArtifacts()
        .find(map => map.keys().next().value.getId() == artifactId)
        .get(getArtifact(player, artifactId));
}

export function hasEnigme(player, enigmeId) {
    return player
        .getEnigmes()
        .some(enigme => enigme.getId() == enigmeId);
}

export function hasEnigmeByNumero(player, enigmeNumero) {
    return player
        .getEnigmes()
        .some(enigme => enigme.getNumero() == enigmeNumero);
}

export function getEnigme(player, enigmeId) {
    return player
        .getEnigmes()
        .find(enigme => enigme.getId() == enigmeId);
}