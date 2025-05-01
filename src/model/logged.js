import knex, { TableBuilder } from "knex"
import Model from "./index.js"

export default class Logged extends Model{
    #createdAt=new Date()

    constructor({
        key={},
        createdAt=new Date()
    }){
        super(key)
        this.#createdAt = createdAt
    }

    get createdAt(){ return this.#createdAt }
    set createdAt(value = new Date()){ this.createdAt = value }

    static makeMe(
        db=knex(),
        model=Logged,
        schema=(t=new TableBuilder())=>{}
    ){
        return db.schema
            .createTable(
                model.name,
                table=>{
                    schema(table)

                    table.dateTime('createdAt')
                        .notNullable()
                        .defaultTo(db.fn.now())
                }
            )
    }
}