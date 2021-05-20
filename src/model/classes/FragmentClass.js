export default class Fragment{
    #id;
    #type;
    #obtained;
    #node;

    constructor(id, type, obtained, node) {
      this.#id = id;
      this.#type = type;
      this.#obtained = obtained;
      this.#node = node;
    }

    getId() {
      return this.#id;
    }

    setId(id) {
        this.#id = id;
    }

    getType() {
      return this.#type;
    }

    setType(type) {
        this.#type = type;
    }

    getObtained() {
      return this.#obtained;
    }

    setObtained(obtained) {
        this.#obtained = obtained;
    }

    getNode() {
      return this.#node;
    }

    setNode(node) {
      this.#node = node;
    }

    toString() {
        return `{"id": ${this.#id}, "type": "${this.#type}", "obtained": ${this.#obtained}}`;
    }

    toObject() {
      return { id : this.#id, type : this.#type, obtained : this.#obtained };
  }
}