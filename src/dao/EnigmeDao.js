import {getDb} from './Dao';
import { getEnigmeFromNode } from '../utils/EnigmeHandler';

const db = getDb();

export async function getAllEnigmes() {
    const enigmesCollection = [];
    const result = await db.all('Enigme');

    result.forEach((node) => {
        enigmesCollection.push(getEnigmeFromNode(node));
    });

    return enigmesCollection;
}

export async function getEnigmeByNumero(numero) {
    const enigmeNode = await db.first('Enigme', {numero: numero});

    if(enigmeNode != false) 
        return getEnigmeFromNode(enigmeNode);
    else 
        return enigmeNode;
}

export async function getEnigmeById(id) {
    const enigmeNode = await db.findById('Enigme', id);

    if(enigmeNode != false) 
        return getEnigmeFromNode(enigmeNode);
    else 
        return enigmeNode;
}