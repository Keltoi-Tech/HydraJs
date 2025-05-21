import Context from "./context";
import { Result, Entity } from "../../model";
import knex from "knex";

export default class Repository{
    #name='';

    myContext

    constructor(entity=Entity,context=new Context())
    {
        this.#name = entity.name

        this.myContext=()=>context.db(this.#name)

        this.resetContext=()=>{
            this.myContext=()=>context.db(this.#name)
        }
    }

    set context(value=knex()){ this.myContext=()=>value(this.#name) }

    insert = (entity = new Entity())=>
        this.myContext()
            .insert(entity.$)
            .then(()=>new Result({data:entity}))
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    create = (entity = new Entity())=>
        this.myContext()
            .insert(entity.data,Object.keys(entity.key))
            .then(ids=>new Result({ 
                data:{ key: ids[0] }
            }))
            .catch(err=>Promise.reject( 
                new Result({code:500,message:err}) 
            ))

    update = (entity = new Entity())=>
        this.myContext()
            .where(entity.key)
            .update(entity.data)
            .then(affected=>new Result({ data:affected }))
            .catch(err=>Promise.reject( 
                new Result({code:500,message:err}) 
            ))

    delete = (entity = new Entity())=>
        this.myContext()
            .where(entity.key)
            .del()
            .then(affected=>new Result({ data:affected }))
            .catch(err=>Promise.reject( 
                new Result({code:500,message:err}) 
            ))

    get = (entity = new Entity())=>
        this.myContext()
            .where(entity.key)
            .first()
            .then(model=>{
                if (!!model) return new Result({ data:model })

                const error = new Result({code:404,message:'Not found'})

                return Promise.reject(error)
            })

    list = ()=>
        this.myContext()
            .select()
            .then(models=>new Result({ data:models }))
}