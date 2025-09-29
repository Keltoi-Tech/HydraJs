import Repository from './base';
import Context from './context';
import { Result, Changeable }  from '../../model';

export default class ChangeableRepository extends Repository{
    constructor(entity = Changeable,context=new Context()){
        super(entity,context)
    }

    reactive = (entity = new Changeable())=>
        this.myContext()
            .where(entity.key)
            .update({active:true})
            .then(affected=> affected > 0 
                ? new Result({ code:200,data:`${this.name} updated` }) 
                : new Result({ code:404,message:'Not found' })
            )
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    remove = (entity = new Changeable())=>
        this.myContext()
            .where(entity.key)
            .update({active:false})
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