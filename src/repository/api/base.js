import Context from "./context"

export default class Repository {
    #context

    constructor(context=new Context()){
        this.#context = context
    }

    static queryString(param={}){
        return '?' + Object.entries(param)
            .map(([k,v])=>`${k}=${v}`)
            .join('&')
    }

    get context(){ return this.#context }
}