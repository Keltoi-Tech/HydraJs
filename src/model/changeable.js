import knex from "knex"
import Entity from "./entity"
import { runWhenFalse } from "../helper"

export default class Changeable extends Entity{
    #createdAt
    #updatedAt  
    #active

    constructor({
        key={},
        struct = {},
        createdAt=new Date(),
        updatedAt=new Date()|undefined,
        active=true
    }){
        super(
            key,
            struct
        )

        this.#createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt)
        this.#updatedAt = updatedAt instanceof Date 
            ? updatedAt 
            : !!updatedAt
                ? new Date(updatedAt)
                : undefined
        this.#active = active
    }

    get createdAt(){ return this.createdAt }
    get updatedAt(){ return this.updatedAt }
    get active(){ return this.active }

    get change(){
        return {
            updatedAt: this.updatedAt
        }
    }

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