import knex, { TableBuilder } from "knex"
import Model from "."

export default class Status extends Model{
    #description=''

    static build=({ id=1,description='' })=>new Status({id,description})

    static makeMe( 
        db=knex(), 
        model=Status, 
        schema=(t=new TableBuilder())=>{} 
    ){
        return db.schema
            .createTable(
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
    }

    constructor({ id=1, description=''}){
        super({id})
        this.#description = description
    }

    get description(){ return this.#description }
    set description( value='' ){ this.#description = value }

    get entity(){
        return {
            description:this.#description
        }
    }
}