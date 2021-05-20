export default class hasArtifact{
    #selling;
    #relationship;

    constructor(selling, relationship) {
        this.#selling = selling;
        this.#relationship = relationship;
    }

    getSelling() {
        return this.#selling;
    }
  
    setSelling(selling) {
          this.#selling = selling;
    }
  
    toString() {
        return `{ selling : ${this.#selling}}`;
    }

    getRelationship() {
        return this.#relationship;
    }
  
    setRelationship(relationship) {
        this.#relationship = relationship;
    }

    toString() {
        return `{ "selling" : ${this.#selling} }`;
    }

    toObject() {
        return { selling : this.#selling};
    }
}