import knex from "knex"
import Entity from "./entity"
import { runWhenFalse } from "../helper"

export default class Traceable extends Entity{
    constructor({
        key={},
        struct={},
        createdAt=new Date()
    }){
        super(key,{...struct,createdAt})
    } 

    get createdAt(){ return this.data.createdAt }

    static structMe(
        db=knex(),
        model=Traceable,
        schema=(t)=>{}
    ){
        return runWhenFalse(
            db.schema.hasTable(model.name),
            async ()=>Promise.resolve(
                db.schema.createTable(
                    model.name,
                    table=>{
                        table.dateTime('createdAt')
                            .notNullable()
                            .defaultTo(db.fn.now())

                        schema(table)
                    }
                )
            )
        )
    }
}