import knex from "knex"
import Result from "./result"

export default class Entity{
    #key
    #data

    constructor(key={},data={}){
        this.#data = data
        this.#key = key
    }

    get key(){ return this.#key }
    get data(){ return this.#data }

    get $(){ 
        return { ...this.#key, ...this.#data }
    }

    static migrations(){ return [] }

    static structMe(db=knex()){
        throw new Error('Abstract class cant be instantiated')
    }

    static build({ }){
        throw new Error('Abstract class cant be instantiated')
    }

    static fromResult(result=new Result()){
        if(result.isError) return Promise.reject(result)
    }   
}