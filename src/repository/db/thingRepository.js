import Thing from "../../model/thing.js";
import Context from "./context.js";
import Repository from "./index.js";

export default class ThingRepository extends Repository{
    constructor(context=new Context()){
        super(model=Thing,context)
    }

    getByName=(name='')=>this.myContext()
        .where({name})
        .select()
        .then(model=>this.modelInstance(model))
}