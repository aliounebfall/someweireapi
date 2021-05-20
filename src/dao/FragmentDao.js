import {getDb} from './Dao';
import { getFragmentFromNode } from '../utils/FragmentHandler';

const db = getDb();

export async function createFragment(newFragment) {
    const fragmentNode = await db.create('Fragment', newFragment);

    return getFragmentFromNode(fragmentNode);
}

export async function getAllFragments() {
    let fragmentsArray = [];

    const weivelliteNode = await db.first('Fragment', {type: 'Weivellite'});
    const weitherNode = await db.first('Fragment', {type: 'Weither'});
    const weilleniumNode = await db.first('Fragment', {type: 'Weillenium'});

    fragmentsArray.push(getFragmentFromNode(weivelliteNode));
    fragmentsArray.push(getFragmentFromNode(weitherNode));
    fragmentsArray.push(getFragmentFromNode(weilleniumNode));

    return fragmentsArray;
}

export async function updateFragmentObtained(fragment, obtained) {
    let node = await fragment.getNode().update({obtained : obtained});

    fragment.setObtained(node.get('obtained').toInt());

    return fragment;
}

export async function getFragmentByType(type) {
    const fragmentNode = await db.first('Fragment', {type: type});

    return getFragmentFromNode(fragmentNode);
}