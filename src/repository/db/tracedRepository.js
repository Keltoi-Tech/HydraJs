import Traced from '../../model/traced.js';
import Context from './context.js';
import Repository from './index.js';

export default class TracedRepository extends Repository{
    constructor(model=Traced,context=new Context()){
        super(model,context)
    }

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
        .orderBy('createdAt')
        .then(result => Repository.setOrEmpty(result,this.modelInstance))

    last=()=>this.myContext()
        .first()
        .orderBy('createdBy',order="desc")
        .then(result => Repository.anyOrError(result,{code:400,message:'Not found'}))

    first=()=>this.myContext()
        .first()
        .orderBy('createdBy',order="asc")
        .then(result => Repository.anyOrError(result,{code:400,message:'Not found'}))

    create=(traced=new Traced())=>this.myContext()
        .insert({ ...traced.entity, createdAt:new Date().toISOString() }, Object.keys(model.key))
        .then(ids=>model.key = ids[0])
        .then(()=> model)
}