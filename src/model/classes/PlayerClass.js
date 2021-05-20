export default class Player{
    #id;
    #name;
    #description;
    #userAddress;
    #artifacts = [];
    #auctions = [];
    #fragments = [];
    #enigmes = []
    #node;

    constructor(id, name, description, userAddress, node) {
      this.#id = id;
      this.#name = name;
      this.#description = description;
      this.#userAddress = userAddress;
      this.#node = node;
    }

    getId() {
      return this.#id;
    }

    setId(id) {
        this.#id = id;
    }

    getName() {
      return this.#name;
    }

    setName(name) {
        this.#name = name;
    }

    getDescription() {
      return this.#description;
    }

    setDescription(description) {
      this.#description = description;
    }

    getUserAddress() {
      return this.#userAddress;
    }

    setUserAddress(userAddress) {
      this.#userAddress = userAddress;
    }

    getArtifacts(){
      return this.#artifacts;
    }

    getAuctions(){
      return this.#auctions;
    }

    getFragments(){
      return this.#fragments;
    }

    getEnigmes(){
      return this.#enigmes;
    }

    addArtifact(artifact, hasArtifact) {
      this.getArtifacts().push(new Map().set(artifact, hasArtifact));
    }

    removeArtifact(artifactId) {
      this.#artifacts = this.#artifacts.filter(map => map.keys().next().value.getId() != artifactId);
    }

    addFragment(fragment, hasFragment) {
      this.#fragments.push(new Map().set(fragment, hasFragment));
    }

    removeFragment(fragmentId) {
      this.#fragments = this.#fragments.filter(map => map.keys().next().value.getId() != fragmentId);
    }

    addEnigme(enigme) {
      this.#enigmes.push(enigme);
    }

    removeEnigme(enigmeId) {
      this.#enigmes = this.#enigmes.filter((item) => {item.getId() != enigmeId});
    }

    addAuction(auction) {
      this.#auctions.push(auction);
    }

    removeAuction(auctionId) {
      this.#auctions = this.#auctions.filter(item => item.getId() != auctionId);
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

    getObjectArray(array){
      const ar = [];
      return array.map(object => object.toObject());
    }

    toString() {
        return `{ "id" : ${this.#id},
                  "name" : "${this.#name}", 
                  "description" : "${this.#description}", 
                  "userAddress" : "${this.#userAddress}", 
                  - "fragments" : ${this.getStringMapArray(this.#fragments)}, 
                  - "enigmes" :  ${this.#enigmes}, 
                  - "artifacts" :  ${this.getStringMapArray(this.#artifacts)},
                  - "auctions" :  ${this.#auctions}`;
    }

    toObject() {
      return {
        id: this.#id,
        name: this.#name,
        description :this.#description,
        userAddress: this.#userAddress,
        fragments: this.getObjectMapArray(this.#fragments),
        enigmes: this.getObjectArray(this.#enigmes),
        artifacts: this.getObjectMapArray(this.#artifacts),
        auctions: this.getObjectArray(this.#auctions)
      }
    }
}