import { Result, Thing } from "../../model"
import Repository from "./base"

export default class ThingRepository extends Repository{
    constructor(entity = Thing,context=new Context()){
        super(entity,context)
    }

    getByName = (name='') =>
        this.myContext()
            .where({name})
            .first()
            .then(result=>!!result
                ?new Result({data:result})
                :new Result({code:404,message:'Not found'})
            )
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))
}