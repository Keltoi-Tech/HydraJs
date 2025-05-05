import Logged from '../../model/logged.js';
import Context from './context.js';
import Repository from './index.js';

export default class LoggedRepository extends Repository{
    constructor(model=Logged,context=new Context()){
        super(model,context)
    }

    get = (logged = new Logged())=>
        this.myContext()
            .where({...logged.key})
            .first()
            .then(model => Repository.anyOrError(model,{code:404,message:'Not found'}))
            .then(this.Entity.build)

    before = (date = new Date(), order = 'asc')=>
        this.myContext()
            .where('createdAt','<',date.toISOString())
            .select()
            .orderBy('createdAt',order)
            .then(result => Repository.setOrEmpty(result,this.Entity.build))

    after = (date = new Date(), order = 'asc')=>
        this.myContext()
            .where('createdAt','>',date.toISOString())
            .select()
            .orderBy('createdAt',order)
            .then(result => Repository.setOrEmpty(result,this.Entity.build))

    list = (order='asc')=>
        this.myContext()
            .select()
            .orderBy('createdAt',order)
            .then(result => Repository.setOrEmpty(result,this.Entity.build))

    insert = (logged = new Logged())=>
        this.myContext()
            .insert({
                ...logged.entity,
                createdAt:new Date().toISOString()  
            },Object.keys(logged.key))
            .then(ids => logged.key = ids[0])
            .then(() => logged)

    create = (logged = new Logged())=>
        this.myContext()
            .insert({
                ...logged.entity,
                createdAt:new Date().toISOString() 
            })
            .then(() => logged)

    update = ()=> Promise.reject(new Error('Cannot update a logged object'))

    delete = ()=> Promise.reject(new Error('Cannot delete a logged object'))
    
}