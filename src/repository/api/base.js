import Context from "./context"
import { Entity } from "../../model"

export default class Repository {
    #context

    constructor(entity=Entity,context=new Context()){
        this.#context = context
    }

    static queryString(param={}){
        return '?' + Object.entries(param)
            .map(([k,v])=>`${k}=${v}`)
            .join('&')
    }

    get context(){ return this.#context }
}