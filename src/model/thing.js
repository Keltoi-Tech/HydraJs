import knex, { TableBuilder } from "knex";
import Model from "./index.js";


export default class Thing extends Model{
    #name
    constructor({
        key={},
        name=''
    }){
        super(key)
        this.#name = name
    }

    get name(){ return this.#name }
    set name(value=''){ this.#name=value }    

    get entity(){
        return { name:this.#name }
    }

    static makeMe(
        db=knex(),
        thing=Thing,
        schema=(t=new TableBuilder())=>{}
    ){
        return db.schema
            .createTable(
                thing.name,
                table=>{
                    schema(table)

                    table.string(255)
                        .notNullable()
                }
            )
    }
}