export default class RewardsFragment{
    #quantite;
    #relationship;

    constructor(quantite, relationship) {
        this.#quantite = quantite;
        this.#relationship = relationship;
    }

    getQuantite() {
        return this.#quantite;
    }
  
    setQuantite(quantite) {
          this.#quantite = quantite;
    }
  
    toString() {
        return `{ quantite : ${this.#quantite}}`;
    }

    getRelationship() {
        return this.#relationship;
    }
  
    setRelationship(relationship) {
        this.#relationship = relationship;
    }

    toString() {
        return `{"quantite" : ${this.#quantite} }`;
    }

    toObject() {
        return { quantite : this.#quantite};
    }
}
