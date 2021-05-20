import { token } from "morgan";

export default class Artifact{
    #id;
    #tokenId;
    #name;
    #description;
    #artifactType;
    #rarity;
    #node;

    constructor(id,
                tokenId,
                name, 
                description,
                artifactType,
                rarity,
                node) {
      this.#id = id;
      this.#tokenId = tokenId;
      this.#name = name;
      this.#description = description;
      this.#artifactType = artifactType;
      this.#rarity = rarity;
      this.#node = node;
    }

    getId() {
      return this.#id;
    }

    setId(id) {
        this.#id = id;
    }

    getTokenId() {
      return this.#tokenId;
    }

    setTokenId(tokenId) {
        this.#tokenId = tokenId;
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

    getArtifactType(){
      return this.#artifactType;
    }

    setArtifactType(artifactType){
      this.#artifactType = artifactType;
    }

    getRarity(){
      return this.#rarity;
    }

    setRarity(rarity){
      this.#rarity = rarity;
    }

    getNode() {
      return this.#node;
    }

    setNode(node) {
      this.#node = node;
    }

    toString() {
        return `{ "id": ${this.#id}, "tokenId": ${this.#tokenId}, "name": "${this.#name}", "description": "${this.#description}", "type": "${this.#artifactType}", "rarity": "${this.#rarity}"}`;
    }

    toObject() {
      return {  id : this.#id,
                tokenId : this.#tokenId,
                name : this.#name,
                description : this.#description,
                type: this.#artifactType,
                rarity: this.#rarity
              }
    }
}