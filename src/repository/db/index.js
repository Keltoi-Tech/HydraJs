import knex from "knex";
import Model from "../../model/index.js";
import Context from "./context.js";


export default class Repository{
    #name='';

    myContext

    static anyOrError(model,err={code:0,message:''}){
        if (!!model) return model

        throw err;
    }

    static setOrEmpty(array=[],modeling=(e)=>e){
        return array.length ? array.map(modeling) : []
    }

    constructor(model=Model,context=new Context())
    {
        this.#name = model.name
        this.myContext=()=>context.db(this.#name)
        this.resetContext=()=>{
            this.myContext=()=>context.db(this.#name)
        }
        this.modelInstance=(m={})=>model.build(m)
    }

    set context(value=knex()){ this.myContext=()=>value(this.#name)}

    insert=(model=new Model())=>
        this.myContext()
        .insert(model.entity,Object.keys(model.key))
        .then(ids=>model.key = ids[0])
        .then(()=>model)

    update=(model=new Model())=>
        this.myContext()
        .where(model.key)
        .update(model.entity)
        .then(affected=>affected > 0)

    delete=(key={})=>
        this.myContext()
        .where(key)
        .del()
        .then(affected=>affected > 0)

    get=(key={})=>
        this.myContext()
       .where(key)
       .first()
       .then(model=>Repository.anyOrError(model,{code:404,message:'Not found'}))
       .then(this.modelInstance) 

    list=()=>
        this.myContext()
        .select()
        .then(result=>Repository.setOrEmpty(result,this.modelInstance))
}