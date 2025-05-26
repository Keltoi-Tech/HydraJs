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
            .then(ids=>{
                entity.key = ids[0]

                return new Result({  data:entity.$ })
            })
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    update = (entity = new Entity())=>
        this.myContext()
            .where(entity.key)
            .update(entity.data)
            .then(affected=> affected > 0 
                ? new Result({ code:200,message:`${this.#name} updated` }) 
                : new Result({ code:404,message:'Not found' })
            )
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    delete = (entity = new Entity())=>
        this.myContext()
            .where(entity.key)
            .del()
            .then(affected=> affected > 0 
                ? new Result({ code:200,message:`${this.#name} deleted` })
                : new Result({ code:404,message:'Not found' })
            )
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    get = (entity = new Entity())=>
        this.myContext()
            .where(entity.key)
            .first()
            .then(Repository.resultModelOrError)

    list = ()=>
        this.myContext()
            .select()
            .then(models=>new Result({ data:models }))
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    static resultModelOrError(model){
        if (!!model) return new Result({ data:model })

        const error = new Result({code:404,message:'Not found'})

        return Promise.reject(error)
    }
}