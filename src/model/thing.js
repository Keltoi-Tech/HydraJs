import knex, { TableBuilder } from "knex";
import Model from "./index.js";
import runWhenFalse from "../helper/runWhenFalse.js";
import runWhenTrue from "../helper/runWhenTrue.js";


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
        size = 255,
        schema=(t=new TableBuilder())=>{}
    ){
        return runWhenFalse(
            db.schema.hasTable(thing.name),
            ()=>db.schema.createTable(
                thing.name,
                table=>{
                    schema(table)

                    table.string(size)
                        .notNullable()
                }
            )
        )
    }
}