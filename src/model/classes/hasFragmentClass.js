export default class hasFragment{
    #has;
    #relationship;

    constructor(has, relationship) {
        this.#has = has;
        this.#relationship = relationship;
    }

    getHas() {
        return this.#has;
    }
  
    setHas(has) {
          this.#has = has;
    }
  
    toString() {
        return `{ has : ${this.#has}}`;
    }

    getRelationship() {
        return this.#relationship;
    }
  
    setRelationship(relationship) {
        this.#relationship = relationship;
    }

    toString() {
        return `{"has" : ${this.#has} }`;
    }

    toObject() {
        return { has : this.#has};
    }
}