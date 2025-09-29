import knex from "knex";
import Entity from "./entity";
import { runWhenFalse } from "../helper";


export default class Thing extends Entity{
    constructor({
        key={},
        name='',
        struct={}
    }){
        super(key,{ name, ...struct });
    }

    get name(){ return this.data.name }
    set name(value=''){ this.data.name = value }    

    static structMe(
        db=knex(),
        thing=Thing,
        size = 255,
        schema=(t)=>{}
    ){
        return runWhenFalse(
            db.schema.hasTable(thing.name),
            ()=>Promise.resolve(
                db.schema.createTable(
                    thing.name,
                    table=>{
                        table.string('name',size)
                            .notNullable()

                        schema(table)
                    }
                )
            )
        )
    }
}