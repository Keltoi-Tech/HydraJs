import Traced from '../../model/traced.js';
import Context from './context.js';
import Repository from './index.js';

export default class TracedRepository extends Repository{
    constructor(model=Traced,context=new Context()){
        super(model,context)
    }

    deceased = (order = 'asc')=>
        this.myContext()
            .where({active:false})
            .select()
            .orderBy(['createdAt','updatedAt'],order)
            .then(result => Repository.setOrEmpty(result,this.Entity.build))

    before = (date = new Date(), order = 'asc')=>
        this.myContext()
            .where('createdAt','<',date.toISOString())
            .where({active:true})
            .select()
            .orderBy(['createdAt','updatedAt'],order)
            .then(result => Repository.setOrEmpty(result,this.Entity.build))

    after = (date=new Date(), order = 'asc')=>
        this.myContext()
            .where('createdAt','>',date.toISOString())
            .where({active:true})
            .select()
            .orderBy(['createdAt','updatedAt'],order)
            .then(result => Repository.setOrEmpty(result,this.Entity.build))

    list = (order = 'asc')=>
        this.myContext()
            .where({active:true})
            .select()
            .orderBy(['createdAt','updatedAt'],order)
            .then(result => Repository.setOrEmpty(result,this.Entity.build))

    last = ()=>
        this.myContext()
            .where({active:true})
            .first()
            .orderBy('createdAt',"desc")
            .then(result => Repository.anyOrError(result,{code:404,message:'Not found'}))

    first = ()=>
        this.myContext()
            .where({active:true})
            .first()
            .orderBy('createdAt',"asc")
            .then(result => Repository.anyOrError(result,{code:404,message:'Not found'}))

    insert = (traced=new Traced())=>
        this.myContext()
            .insert({ 
                ...traced.entity, 
                createdAt:new Date().toISOString() 
            }, Object.keys(traced.key))
            .then(ids=>traced.key = ids[0])
            .then(()=> traced)

    create = (traced=new Traced())=>
        this.myContext()
            .insert({
                    ...traced.key, 
                    ...traced.entity, 
                    createdAt:new Date().toISOString() 
            })
            .then(()=> traced)

    update = (traced=new Traced())=>
        this.myContext()
            .where(traced.key)
            .update({
                ...traced.entity,
                updatedAt:new Date().toISOString()
            })
            .then(affected=>affected > 0)

    delete = (traced=new Traced())=>
        this.myContext()
            .where(traced.key)
            .update({
                active:false,
                updatedAt:new Date().toISOString()
            })
            .then(affected=>affected > 0)
}