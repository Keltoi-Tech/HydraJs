import knex from "knex"
import Model from "./index.js"

export default class Logged extends Model{
    #createdAt=new Date()
    #updatedAt=new Date()|undefined
    #active=true

    constructor({key={},createdAt=new Date(),updatedAt=new Date()|undefined,active=true}){
        super(key)
        this.#active=active
        this.#updatedAt = updatedAt
        this.#createdAt = createdAt
    }

    get createdAt(){return this.#createdAt}
    set createdAt(value = new Date()){this.createdAt = value}

    get updatedAt(){return this.#updatedAt}
    set updatedAt(value = new Date()){this.#updatedAt = value}

    get active(){return this.#active}
    set active(value = true){this.#active = value}

    static makeMe(db=knex(),model=Model,schema=(t=new knex.TableBuilder())=>{}){
        return db.schema.createTable(model.name,table=>{
            schema(table)

            table.dateTime('createdAt').notNullable().defaultTo(db.fn.now())
            table.dateTime('updatedAt').nullable()
            table.boolean('active').defaultTo(true)
        })
    }
}