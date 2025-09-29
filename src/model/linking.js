import knex from "knex"
import Entity from "./entity"
import { runWhenFalse } from "../helper"

export default class Linking{
    #abscissa=new Entity()
    #ordinate=new Entity()
    #AbscissaEntity=Entity
    #OrdinateEntity=Entity

    static get name(){ return null }

    get Abscissa(){
        return this.#AbscissaEntity
    }

    get Ordinate(){
        return this.#OrdinateEntity
    }

    constructor(
        AbscissaEntity=Entity,
        OrdinateEntity=Entity,
        {
            abscissa=new AbscissaEntity(),
            ordinate=new OrdinateEntity()
        })
    {
        this.#AbscissaEntity = AbscissaEntity
        this.#OrdinateEntity = OrdinateEntity

        this.#abscissa = abscissa
        this.#ordinate = ordinate
    }

    static build=({
        AbscissaEntity=Entity,
        OrdinateEntity=Entity,
        abscissa=new Entity(),
        ordinate=new Entity()
    })=>new Linking(AbscissaEntity,OrdinateEntity,{abscissa,ordinate})

    static structMe(
        db=knex(),
        abscissa=Entity,
        ordinate=Entity,
        schema=(t)=>{}
    ){
        const tableName = this.name ?? `${abscissa.name}${ordinate.name}`

        return runWhenFalse(
            db.schema.hasTable(tableName),
            () => Promise.resolve(
                db.schema.createTable(tableName, table=>{ schema(table) })
            )
        )
    }

    static migrations(){ return [] }

    get abscissaKey(){
        return { idAbscissa: this.#abscissa.key }
    }

    get ordinateKey(){
        return { idOrdinate: this.#ordinate.key }
    }

    get $(){
        return {
            ...this.abscissaKey,
            ...this.ordinateKey
        }
    }

    get entity(){}

    get abscissa(){ return this.#abscissa }
    set abscissa(value = this.Abscissa.build()){ this.#abscissa = value }

    get ordinate(){ return this.#ordinate }
    set ordinate(value = this.Ordinate.build()){ this.ordinate = value }

}