import knex from "knex"
import Entity from "./entity"
import { runWhenFalse } from "../helper"

export default class Status extends Entity{
    static build=({ id=1,description='',data={} })=>new Status({id,description,data})

    static structMe( 
        db=knex(), 
        model=Status, 
        schema=(t)=>{} 
    ){
        return runWhenFalse(
            db.schema.hasTable(model.name),
            ()=>Promise.resolve(
                db.schema.createTable(
                    model.name,
                    table=>{
                        table.increments()

                        table
                            .string('status',50)
                            .notNullable()
                            .unique()

                        schema(table)
                    }
                )
            )
        )
    }

    constructor({ id=1, description='', data={}}){
        super({ id }, { status:description, ...data })
    }

    get description(){ return this.data.status }
    set description( value='' ){ this.data.status = value}
}