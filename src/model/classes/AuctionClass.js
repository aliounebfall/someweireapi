export default class Auction{
    #id;
    #address;
    #node;

    constructor(id, address, node) {
      this.#id = id;
      this.#address = address;
      this.#node = node;
    }

    setId(id) {
      this.#id = id;
    }

    getId() {
      return this.#id;
    }

    getAddress() {
      return this.#address;
    }

    setAddress(address) {
        this.#address = address;
    }

    getNode() {
      return this.#node;
    }

    setNode(node) {
      this.#node = node;
    }

    toString() {
        return `{"id": ${this.#id}, "address": ${this.#address}}`;
    }

    toObject() {
      return {id : this.#id, address : this.#address};
  }
}