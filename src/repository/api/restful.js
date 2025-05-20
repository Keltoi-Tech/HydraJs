import Repository from "./base"
import Context from "./context"

import { Entity, Result } from "../../model"

export default class RestfulRepository extends Repository{
    constructor(entity = Entity,context=new Context()){
        super(entity,context)
    }

    #keysAsParams(route='',key={}){
        const params = Object.keys(key)

        params.forEach(param=>
            route = route.replace(`:${param}`,key[param])
        )        

        return route
    }

    #httpGet=(route='',query={}|undefined)=>this.context
        .http
        .get(!! query ? `${route}${Repository.queryString(query)}` : route)
        .then(value=>{
            value.status === 200 
                ? new Result({data:value.data}) 
                : Promise.reject(new Result({code:value.status, message:value.statusText}))
        })

    get=(route='',query={}|undefined)=>this.#httpGet(route,query)
        .then(value=>{
            value.status === 200 
                ? new Result({data:value.data}) 
                : Promise.reject(new Result({code:value.status, message:value.statusText}))
        })

    list=(route='',query={}|undefined)=>this.#httpGet(route,query)
        .then(value=>{
            value.status === 200 
                ? new Result({data:value.data}) 
                : Promise.reject(new Result({code:value.status, message:value.statusText}))
        })

    create=(route='',entity=new Entity())=>this.context
        .http
        .post(route,entity.data)
        .then(value=>{
            value.status === 201
                ? new Result({data:value.data}) 
                : Promise.reject(new Result({code:value.status, message:value.statusText}))
        })

    update=(route='',entity=new Entity())=>{
        const url = this.#keysAsParams(route,entity.key)

        return this.context
            .http
            .put(url,model.entity)
            .then(value=>{
                value.status === 200 
                    ? new Result({data:value.data}) 
                    : Promise.reject(new Result({code:value.status, message:value.statusText}))
            })
    }

    change=(route='',entity=new Entity())=>{
        const url = this.#keysAsParams(route,entity.key)

        return this.context
            .http
            .patch(url,model.entity)
            .then(value=>{
                value.status === 200 
                    ? new Result({data:value.data}) 
                    : Promise.reject(new Result({code:value.status, message:value.statusText}))
            })
    }

    delete=(id,entity = new Entity())=>{
        const url = this.#keysAsParams(route,entity.key)

        return this.context
            .http
            .delete(url)
            .then(value=>{
                value.status === 200 
                    ? new Result({data:value.data}) 
                    : Promise.reject(new Result({code:value.status, message:value.statusText}))
            })
    }
}