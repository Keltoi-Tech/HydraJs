import Thing from "../../model/thing.js";
import Context from "./context.js";
import Repository from "./index.js";

export default class ThingRepository extends Repository{
    constructor(model = Thing,context=new Context()){
        super(model,context)
    }

    getByName = (name='') =>
        this.myContext()
            .where({name})
            .select()
            .then(result=>Repository
                .setOrEmpty(result,this.Entity.build)
            )
}