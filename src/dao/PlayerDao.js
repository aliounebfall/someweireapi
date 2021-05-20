import {getDb} from './Dao';
import * as PlayerHandler from '../utils/PlayerHandler';
import {getFragmentFromNode} from '../utils/FragmentHandler';
import { getArtifactFromNode } from '../utils/ArtifactHandler';
import { getEnigmeFromNode } from '../utils/EnigmeHandler';
import { getAuctionFromNode } from '../utils/AuctionHandler';

import HasFragment from '../model/classes/hasFragmentClass';
import HasArtifact from '../model/classes/hasArtifactClass';

const db = getDb();

export async function getAllPlayers() {
    const playersCollection = [];
    const result = await db.all('Player');

    result.forEach((node) => {
        playersCollection.push(PlayerHandler.getPlayerFromNode(node));
    });

    return playersCollection;
}

export async function getPlayerByName(name) {
    const playerNode = await db.first('Player', {'name': name});

    if(playerNode != false)
        return PlayerHandler.getPlayerFromNode(playerNode);
    else 
        return playerNode;
}

export async function getPlayerByUserAddress(userAddress) {
    const playerNode = await db.first('Player', {'userAddress': userAddress.toLowerCase()});

    if(playerNode != false) 
        return PlayerHandler.getPlayerFromNode(playerNode);
    else 
        return playerNode;
}

export async function getPlayerById(id) {
    const playerNode = await db.findById('Player', id);

    if(playerNode != false) 
        return PlayerHandler.getPlayerFromNode(playerNode);
    else 
        return playerNode;
}

export async function createPlayer(newPlayer) {
    const playerNode = await db.create('Player', newPlayer);

    return PlayerHandler.getPlayerFromNode(playerNode);
}

export async function updatePlayer(player, playerObject) {
    let node = await player.getNode().update(playerObject);

    player.setName(node.get('name'));
    player.setDescription(node.get('description'));

    return player;
}

export async function addFragmentToPlayer(player, fragment, has) {
    const relationship = await player.getNode().relateTo(
        fragment.getNode(),
        'hasFragment',
        {has: has});

    let fragmentAmount = 0;

    if(relationship.get('has') != 0)
        fragmentAmount = relationship.get('has').toInt();

    const hasFragment = new HasFragment(fragmentAmount, relationship);

    player.addFragment(getFragmentFromNode(relationship.endNode()), hasFragment);

    return player;
}

export async function updateHasFragmentToPlayer(player, fragmentId, has) {

    await PlayerHandler
        .getHasFragment(player, fragmentId)
        .getRelationship()
        .update({has: has});

    PlayerHandler
        .getHasFragment(player, fragmentId)
        .setHas(has);

    return player;
}

export async function updateHasFragmentByTypeToPlayer(player, type, has) {

    await PlayerHandler
        .getHasFragmentByType(player, type)
        .getRelationship()
        .update({has: has});

    PlayerHandler
        .getHasFragmentByType(player, type)
        .setHas(has);

    return player;
}

export async function addSolvedEnigmeToPlayer(player, enigme) {
    const relationship = await player.getNode().relateTo(
        enigme.getNode(),
        'solved');

    player.addEnigme(getEnigmeFromNode(relationship.endNode()));

    return player;
}

export async function addArtifactToPlayer(player, artifact) {
    const relationship = await player.getNode().relateTo(
        artifact.getNode(),
        'hasArtifact', 
        {selling: false});

    const hasArtifact = new HasArtifact(relationship.get('selling'), relationship);
    
    player.addArtifact(getArtifactFromNode(relationship.endNode()), hasArtifact);

    return player;
}

export async function updateArtifactAttributesFromPlayer(player, artifactId, artifactObject) {

    await PlayerHandler
        .getArtifact(player, artifactId)
        .getNode()
        .update(artifactObject);

    PlayerHandler
        .getArtifact(player, artifactId)
        .setName(artifactObject.name);
        
    PlayerHandler
        .getArtifact(player, artifactId)
        .setDescription(artifactObject.description);

    return player;
}

export async function updateArtifactSoldFromPlayer(player, artifactId, selling) {

    await PlayerHandler
        .getHasArtifact(player, artifactId)
        .getRelationship()
        .update({selling: selling});

    PlayerHandler
        .getHasArtifact(player, artifactId)
        .setSelling(selling);

    return player;
}

export async function removeArtifactFromPlayer(player, artifact){
    await player.getNode().detachFrom(artifact.getNode());

    player.removeArtifact(artifact.getId());

    return player;
}

export async function addAuctionToPlayer(player, auction) {
    const relationship = await player.getNode().relateTo(
        auction.getNode(),
        'created');

    player.addAuction(getAuctionFromNode(relationship.endNode()));

    return player;
}