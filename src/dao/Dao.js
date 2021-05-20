import Neode from 'neode';
import path from "path";

const schemaPath= path.join(process.cwd(), 'src', 'model', 'schema');

export function getDb (){
    return Neode
            .fromEnv()
            .withDirectory(schemaPath);
}