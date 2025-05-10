import Result from "../model/result"
import Context from "../repository/db/context"

export default class Service {
    #context
    constructor(context=new Context()){
        this.#context = context
    }

    get context(){return this.#context}    

    handleError = (code,message)=>Promise.reject(new Result({code,message}))
    handleFailure = (err)=> this.handleError({code:500,message:err.message})
}
