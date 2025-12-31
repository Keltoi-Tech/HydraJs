import Context from './context';
import Repository from './base';
import { Result, Traceable } from '../../model';

export default class TraceableRepository extends Repository{
    constructor(entity=Traceable,context=new Context()){
        super(entity,context)
    }

    get = (traceable = new Traceable()) =>
        this.myContext()
            .where(traceable.key)
            .first()
            .then(Repository.resultModelOrError)
            .catch(err=>Promise.reject( new Result({code:500,message:err})) )

    before = (date = new Date(), order = 'asc') =>
        this.myContext()
            .where('createdAt','<',date.toISOString())
            .select()
            .orderBy('createdAt',order)
            .then(result => new Result({data:result}))
            .catch(err=>Promise.reject( new Result({code:500,message:err})) )

    after = (date = new Date(), order = 'asc') =>
        this.myContext()
            .where('createdAt','>',date.toISOString())
            .select()
            .orderBy('createdAt',order)
            .then(result => new Result({data:result}))
            .catch(err=>Promise.reject( new Result({code:500,message:err})) )

    list = (order='asc') =>
        this.myContext()
            .select()
            .orderBy('createdAt',order)
            .then(result => new Result({data:result}))
            .catch(err=>Promise.reject( new Result({code:500,message:err})) )

    insert = (entity = new Traceable()) =>
        this.myContext()
            .insert({
                ...entity.$,
                createdAt:entity.createdAt
            })
            .then(()=>new Result({ data:entity }))
            .catch(err=>Promise.reject( new Result({code:500,message:err})) )

    create = (entity = new Traceable()) =>
        this.myContext()
            .insert(
                {
                    ...entity.data,
                    createdAt:new Date()
                },
                Object.keys(entity.key)
            )
            .then(ids=>{
                entity.key = ids[0]

                return new Result({ data:entity })
            })
            .catch(err=>Promise.reject( new Result({code:500,message:err})) )

    update = () => Promise.reject( new Result({code:400,message:'Cannot update a logged object'}) )

    delete = () => Promise.reject( new Result({code:400,message:'Cannot delete a logged object'}) )
    
}