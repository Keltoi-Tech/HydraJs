import Model  from "../../model/index.js"
import Context from "./context.js"

export default class Repository{
    #context

    constructor(model=Model,context=new Context()){
        this.#context = context
        this.modelInstance=(m={})=>new model(m)
    }

    static queryString(param={}){
        return '?' + Object.entries(param)
            .map(([k,v])=>`${k}=${v}`)
            .join('&')
    }

    get context(){ return this.#context }
}