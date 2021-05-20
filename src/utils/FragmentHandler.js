import Fragment from '../model/classes/FragmentClass.js';

export function getFragmentFromNode(node) {
    return new Fragment(
        node.identity().toInt(),
        node.get('type'), 
        node.get('obtained').toInt(),
        node); 
}