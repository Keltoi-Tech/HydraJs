import Entity from "./entity"

export default class Model {
    constructor({}) {
        
    }

    static fromEntity(entity = new Entity()) {
        return new Model(entity.$)
    }

    validate(){}
}