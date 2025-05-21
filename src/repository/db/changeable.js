import Repository from './base';
import Context from './context';
import { Result, Changeable }  from '../../model';

export default class ChangeableRepository extends Repository{
    constructor(entity = Changeable,context=new Context()){
        super(entity,context)
    }

    deceased = (order = 'asc') =>
        this.myContext()
            .where({active:false})
            .select()
            .orderBy(['createdAt','updatedAt'],order)
            .then(result => new Result({data:result}))

    before = (date = new Date(), order = 'asc') =>
        this.myContext()
            .where('createdAt','<',date.toISOString())
            .where({active:true})
            .select()
            .orderBy(['createdAt','updatedAt'],order)
            .then(result => new Result({data:result}))

    after = (date=new Date(), order = 'asc') =>
        this.myContext()
            .where('createdAt','>',date.toISOString())
            .where({active:true})
            .select()
            .orderBy(['createdAt','updatedAt'],order)
            .then(result => new Result({data:result}))

    list = (order = 'asc') =>
        this.myContext()
            .where({active:true})
            .select()
            .orderBy(['createdAt','updatedAt'],order)
            .then(result => new Result({data:result}))

    last = () =>
        this.myContext()
            .where({active:true})
            .first()
            .orderBy('createdAt',"desc")
            .then(result => {
                if (!!result) return result

                const error = new Result({code:404,message:'Not found'})

                return Promise.reject(error)
            })

    first = () =>
        this.myContext()
            .where({active:true})
            .first()
            .orderBy('createdAt',"asc")
            .then(result => {
                if (!!result) return result

                const error = new Result({code:404,message:'Not found'})

                return Promise.reject(error)
            })
}