import knex, { TableBuilder } from "knex"
import Logged from "./logged.js"

export default class Traced extends Logged{
    #updatedAt=new Date()|undefined
    #active=true

    constructor({
        key={},
        createdAt=new Date(),
        updatedAt=new Date()|undefined,
        active=true
    }){
        super({ key,createdAt })
        this.#active=active
        this.#updatedAt = updatedAt
    }

    get updatedAt(){ return this.#updatedAt }
    set updatedAt(value = new Date()){ this.#updatedAt = value }

    get active(){ return this.#active }
    set active(value = true){ this.#active = value }

    tickUpdateNow(){
        this.#updatedAt = new Date()
    }

    static makeMe(
        db=knex(),
        model=Traced,
        schema=(t=new TableBuilder())=>{}
    ){
        return super.makeMe(db,model,table=>{
            schema(table)

            table.dateTime('updatedAt')
                .nullable()

            table.boolean('active')
                .defaultTo(true)
        })
    }
}