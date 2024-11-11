import Logged from '../../model/logged.js';
import Context from './context.js';
import Repository from './index.js';

export default class LoggedRepository extends Repository{
    constructor(model=Logged,context=new Context()){
        super(model,context)
    }

    deceased=()=>this.myContext()
        .where({active:false})
        .select()
        .then(deads=>deads.map(this.modelInstance))

    get=(key={})=>this.myContext()
        .where({...key,active:true})
        .first()
        .then(this.modelInstance)

    before=(date=new Date())=>this.myContext()
        .where('createdAt','<',date.toISOString())
        .select()
        .then(result=>result.map(this.modelInstance))

    after=(date=new Date())=>this.myContext()
        .where('createdAt','>',date.toISOString())
        .select()
        .then(result=>result.map(this.modelInstance))

    list=()=>this.myContext()
        .select()
        .orderBy('createdAt','updatedAt')
        .where({active:true})
        .then(result=>result.map(this.modelInstance))

    update=(model=new Logged())=>
        this.myContext()
        .where(model.key)
        .update({
            ...model.entity,
            updatedAt:new Date()
        })
        .then(affected=> affected > 0)

    delete=(key={})=>
        this.myContext()
        .where(key)
        .update({
            updatedAt:new Date().toISOString(),
            active:false
        })
        .then(affected=> affected > 0)
    
}