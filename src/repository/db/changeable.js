import Repository from './base';
import Context from './context';
import { Result, Changeable }  from '../../model';

export default class ChangeableRepository extends Repository{
    constructor(entity = Changeable,context=new Context()){
        super(entity,context)
    }

    insert = (entity = new Changeable())=>
        this.myContext()
            .insert({
                ...entity.$,
                createdAt:entity.createdAt,
                active:true
            })
            .then(()=>new Result({ data:entity }))
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    create = (entity = new Changeable())=>
        this.myContext()
            .insert({
                    ...entity.data,
                    active:true
                },
                Object.keys(entity.key)
            )
            .then(ids=>{
                entity.key = ids[0]

                return new Result({ data:entity })
            })
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    update = (entity = new Changeable())=>
        this.myContext()
            .where(entity.key)
            .update({
                ...entity.data,
                updatedAt:new Date()
            })
            .then(affected=> affected > 0 
                ? new Result({ code:200,data:`${this.name} updated` }) 
                : new Result({ code:404,message:'Not found' })
            )
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    reactive = (entity = new Changeable())=>
        this.myContext()
            .where(entity.key)
            .update({
                active:true, 
                updatedAt:new Date()
            })
            .then(affected=> affected > 0 
                ? new Result({ code:200,data:`${this.name} updated` }) 
                : new Result({ code:404,message:'Not found' })
            )
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    remove = (entity = new Changeable())=>
        this.myContext()
            .where(entity.key)
            .update({
                active:false,
                updatedAt:new Date()
            })
            .then(affected=> affected > 0 
                ? new Result({ code:200,data:`${this.name} updated` }) 
                : new Result({ code:404,message:'Not found' })
            )
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    deceased = (order = 'asc') =>
        this.myContext()
            .where({active:false})
            .select()
            .orderBy(['createdAt','updatedAt'],order)
            .then(result => new Result({data:result}))
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    before = (date = new Date(), order = 'asc') =>
        this.myContext()
            .where('createdAt','<',date.toISOString())
            .where({active:true})
            .select()
            .orderBy(['createdAt','updatedAt'],order)
            .then(result => new Result({data:result}))
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))            

    after = (date=new Date(), order = 'asc') =>
        this.myContext()
            .where('createdAt','>',date.toISOString())
            .where({active:true})
            .select()
            .orderBy(['createdAt','updatedAt'],order)
            .then(result => new Result({data:result}))
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    list = (order = 'asc') =>
        this.myContext()
            .where({active:true})
            .select()
            .orderBy(['createdAt','updatedAt'],order)
            .then(result => new Result({data:result}))
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    last = () =>
        this.myContext()
            .where({active:true})
            .first()
            .orderBy('createdAt',"desc")
            .then(Repository.resultModelOrError)

    first = () =>
        this.myContext()
            .where({active:true})
            .first()
            .orderBy('createdAt',"asc")
            .then(Repository.resultModelOrError)
}