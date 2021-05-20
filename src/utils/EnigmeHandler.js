import Enigme from '../model/classes/EnigmeClass.js';
import RewardsFragment from '../model/classes/RewardsFragmentClass.js';
import Fragment from '../model/classes/FragmentClass.js';

export function getEnigmeFromNode(node) {
    const enigme = new Enigme(
        node.identity().toInt(),
        node.get('numero').toInt(), 
        node.get('titre'),
        node.get('solution'), 
        node); 

    if(node.get('rewards') != null)
        node
            .get('rewards')
            .forEach((relationship) => {
                const fragment = new Fragment(
                    relationship.endNode().identity().toInt(),
                    relationship.endNode().get('type'), 
                    relationship.endNode().get('obtained').toInt(), 
                    relationship.endNode());

                enigme.addFragment(fragment, new RewardsFragment(relationship.get('quantite').toInt(), relationship));
            });
    return enigme;
}

export function getFragmentAsArray(enigme) {
    return enigme
        .getFragments()
        .flatMap(map => map.keys().next().value);
}

export function getFragment(enigme) {
    return getFragmentAsArray(enigme)[0];
}

export function getRewardsFragment(enigme){
    return enigme.getFragments()[0].get(getFragment(enigme));
}