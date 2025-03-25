import knex, { TableBuilder } from "knex"
import Model from "./index"

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

    static build=({
        abscissa=new Model(),
        ordinate=new Model()
    })=>new Linking(Model,Model,{abscissa,ordinate})

    constructor(
        AbscissaModel=Model,
        OrdinateModel=Model,
        {
            abscissa = AbscissaModel.build(),
            ordinate = OrdinateModel.build()
        })
    {
        this.#AbscissaModel = AbscissaModel
        this.#OrdinateModel = OrdinateModel

        this.#abscissa = abscissa
        this.#ordinate = ordinate
    }

    static makeMe(
        db=knex(),
        abscissa=Model,
        ordinate=Model,
        schema=(t=new knex.TableBuilder())=>{}
    ){
        return db.schema
            .createTable(
                `${abscissa.name}${ordinate.name}`,
                table=>{
                    schema(table)
                }
            )
    }

    get abscissaKey(){
        return { idAbscissa: this.#abscissa.key['id'] }
    }

    get ordinateKey(){
        return { idOrdinate: this.#ordinate.key['id'] }
    }

    get key(){
        return {
            ...this.abscissaKey,
            ...this.ordinateKey
        }
    }

    get abscissa(){ return this.#abscissa }
    set abscissa(value = new Model()){ this.#abscissa = value }

    get ordinate(){ return this.#ordinate }
    set ordinate(value = new Model()){ this.ordinate = value }

}