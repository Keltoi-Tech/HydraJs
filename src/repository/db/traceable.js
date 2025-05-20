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
            .then(model => {
                if (!!model) return model

                const error = new Result({code:404,message:'Not found'})

                return Promise.reject(error)
            })

    before = (date = new Date(), order = 'asc') =>
        this.myContext()
            .where('createdAt','<',date.toISOString())
            .select()
            .orderBy('createdAt',order)
            .then(result => new Result({data:result}))

    after = (date = new Date(), order = 'asc') =>
        this.myContext()
            .where('createdAt','>',date.toISOString())
            .select()
            .orderBy('createdAt',order)
            .then(result => new Result({data:result}))

    list = (order='asc') =>
        this.myContext()
            .select()
            .orderBy('createdAt',order)
            .then(result => new Result({data:result}))

    update = () => Promise.reject(new Result({code:400,message:'Cannot update a logged object'}))

    delete = () => Promise.reject(new Result({code:400,message:'Cannot delete a logged object'}))
    
}