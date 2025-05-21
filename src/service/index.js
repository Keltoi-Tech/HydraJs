import { Result } from "../model"
import { DbContext } from "../repository/db"

export class Service {
    #context
    constructor(context=new DbContext()){
        this.#context = context
    }

    get context(){return this.#context}    

    handleError = (code,message)=>Promise.reject(new Result({code,message}))
    handleFailure = (err)=> this.handleError({code:500,message:err.message})
}
