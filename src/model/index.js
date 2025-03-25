export default class Model{
    #key

    constructor(key={}){
        this.#key = key
    }

    get key(){ return this.#key }
    set key(value={}){ this.#key=value }    

    get entity(){ return {} }

    static build(key={}){
        return new Model(key)
    }

}