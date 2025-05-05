import knex, { TableBuilder } from "knex"
import Model from "./index"
import runWhenFalse from "../helper/runWhenFalse"

export default class Linking{
    #abscissa=new Model()
    #ordinate=new Model()
    #AbscissaModel=Model
    #OrdinateModel=Model


    get Abscissa(){
        return this.#AbscissaModel
    }

    get Ordinate(){
        return this.#OrdinateModel
    }

    constructor(
        AbscissaModel=Model,
        OrdinateModel=Model,
        {
            abscissa = new AbscissaModel(),
            ordinate = new OrdinateModel()
        })
    {
        this.#AbscissaModel = AbscissaModel
        this.#OrdinateModel = OrdinateModel

        this.#abscissa = abscissa
        this.#ordinate = ordinate
    }

    static build=({
        AbscissaModel=Model,
        OrdinateModel=Model,
        abscissa=new Model(),
        ordinate=new Model()
    })=>new Linking(AbscissaModel,OrdinateModel,{abscissa,ordinate})

    static makeMe(
        db=knex(),
        abscissa=Model,
        ordinate=Model,
        schema=(t=new TableBuilder())=>{}
    ){
        const tableName = `${abscissa.name}${ordinate.name}`

        return runWhenFalse(
            db.schema.hasTable(tableName),
            () => db.schema.createTable(
                tableName,
                table=>{
                    schema(table)
                }
            )
        )
    }


    get abscissaKey(){
        return { idAbscissa: this.#abscissa.key }
    }

    get ordinateKey(){
        return { idOrdinate: this.#ordinate.key }
    }

    get key(){
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