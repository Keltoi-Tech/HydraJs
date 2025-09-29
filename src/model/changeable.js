import knex from "knex"
import Entity from "./entity"
import { runWhenFalse } from "../helper"

export default class Changeable extends Entity{
    constructor({
        key={},
        struct = {},
        createdAt=new Date(),
        updatedAt=new Date()|undefined,
        active=true
    }){
        super(
            key,
            { 
                ...struct,
                createdAt,
                updatedAt,
                active
            }
        )
    }

    get createdAt(){ return this.data.createdAt }
    get updatedAt(){ return this.data.updatedAt }
    get active(){ return this.data.active }

    static structMe(
        db=knex(),
        model=Changeable,
        schema=(t)=>{}
    ){
        return runWhenFalse(
            db.schema.hasTable(model.name),
            ()=>Promise.resolve(
                db.schema.createTable(model.name,table=>{
                    table.dateTime('createdAt')
                        .notNullable()
                        .defaultTo(db.fn.now())

                    table.dateTime('updatedAt')
                        .nullable()

                    table.boolean('active')
                        .defaultTo(true)

                    schema(table)
                })
            )
        )
    }
}