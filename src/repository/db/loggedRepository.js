import Logged from '../../model/logged.js';
import Traced from '../../model/traced.js';
import Context from './context.js';
import Repository from './index.js';

export default class TracedRepository extends Repository{
    constructor(model=Traced,context=new Context()){
        super(model,context)
    }

    deceased=()=>this.myContext()
        .where({active:false})
        .select()
        .then(result => Repository.setOrEmpty(result,this.modelInstance))

    get=(key={})=>this.myContext()
        .where({...key,active:true})
        .first()
        .then(model => Repository.anyOrError(model,{code:404,message:'Not found'}))
        .then(this.modelInstance)

    before=(date=new Date())=>this.myContext()
        .where('createdAt','<',date.toISOString())
        .select()
        .then(result => Repository.setOrEmpty(result,this.modelInstance))

    after=(date=new Date())=>this.myContext()
        .where('createdAt','>',date.toISOString())
        .select()
        .then(result => Repository.setOrEmpty(result,this.modelInstance))

    list=()=>this.myContext()
        .select()
        .orderBy('createdAt','updatedAt')
        .where({active:true})
        .then(result => Repository.setOrEmpty(result,this.modelInstance))

    update=(model=new Logged())=>
        this.myContext()
        .where(model.key)
        .update({
            ...model.entity,
            updatedAt:new Date().toISOString()
        })
        .then(affected => affected > 0)

    delete=(key={})=>
        this.myContext()
        .where(key)
        .update({
            active:false,
            updatedAt:new Date().toISOString()
        })
        .then(affected => affected > 0)
    
}