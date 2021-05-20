export default class Enigme{
    #id;
    #numero;
    #titre;
    #solution;
    #fragments = [];
    #node;

    constructor(id, numero, titre, solution, node) {
      this.#id = id;
      this.#numero = numero;
      this.#titre = titre;
      this.#solution = solution;
      this.#node = node;
    }

    getId() {
      return this.#id;
    }

    getNumero() {
        return this.#numero;
    }

    getTitre() {
        return this.#titre;
    }

    getSolution() {
        return this.#solution;
    }

    setId(id) {
        this.#id = id;
    }
  
    setNumero(numero) {
        this.#numero = numero;
    }
  
    setTitre(titre) {
        this.#titre = titre;
    }
  
    setSolution(solution) {
        this.#solution = solution;
    }

    addFragment(fragment, rewardsFragment) {
        this.#fragments.push(new Map().set(fragment, rewardsFragment));
    }

    getFragments() {
        return this.#fragments;
    }
  
    removeFragment(fragment) {
        this.#fragments = this.#fragments.filter((item) => {item != fragment});
    }

    getNode() {
        return this.#node;
    }
  
    setNode(node) {
        this.#node = node;
    }

    getStringMapArray(array){
        return array.map(objects => [...objects].toString());
    }

    getObjectMapArray(array){
        return array.map(mapObject => {
          let keyClass = mapObject.keys().next().value;
          let keyObject = keyClass.toObject();
          let object = mapObject.get(keyClass).toObject();
          let keyObjectKeys = Object.keys(keyObject);
          keyObjectKeys
            .forEach( key => {
            object[key] = keyObject[key];
          });
          return object;
        });
      }

    // getObjectArray(array){
    //     return array.map(object => object.toObject());
    // }
  

    toString() {
        return `{ "id" : ${this.#id},
                  "numero" : ${this.#numero}, 
                  "titre" : "${this.#titre}", 
                  "solution" : "${this.#solution}", 
                  "fragments" : ${this.getStringMapArray(this.#fragments)} 
                }`;
    }

    toObject() {
        return { id : this.#id,
                  numero : this.#numero, 
                  titre : this.#titre,
                  fragments : this.getObjectMapArray(this.#fragments)
                }
    }
}