
import Model from "../../model/index";
import Linking from "../../model/linking";
import Context from "./context";

export default class DbLinked {
    #linking
    #name=''
    myContext

    constructor(link=Linking,context=new Context){
        this.#name  = link.name
        this.myContext = () => context.db(this.#name)
        this.#linking = link
    }

    #insertBatch=(linkings=[new Linking()])=>
        this.myContext()
            .insert(
                linkings.map(l => l.key())
            )
            .then(()=>linkings)

    insert=(linked=new Linking())=>{
        const key = linked.key()
        
        return this.myContext()
            .insert(key)
            .then(()=>key);
    }

    insertOrdinatesByAbscissa=(abscissa=new Model(),ordinates=[new Model()])=>{
        const batch = ordinates
            .map(o=>this.#linking
                .build({abscissa,o})
            )

        return this.#insertBatch(batch);
    }

    insertAbscissasByOrdinate=(ordinate=new Model(),abscissas=[new Model()])=>{
        const batch = abscissas
            .map(a=>this.#linking
                .build({a,ordinate})
            )

        return this.#insertBatch(batch)
    }

    delete=(linked=new Linking())=>{
        return this.myContext()
            .where(linked.key())
            .del()
            .then(affected=>affected > 0)
    }

    abscissasByOrdinate=(linked=new Linking())=>{
        const Abscissa = linked.Abscissa
        const keys = Object.keys(linked.abscissaKey)

        const fields = keys.map(key=>`${this.#name}.${key}`)
        const abscissas = keys.map(key=>`${Abscissa.name}.${key}`)

        return this.myContext()
            .where(linked.ordinateKey)
            .select(fields)
            .join(Abscissa.name,clause=>
                fields.forEach((field,i)=>{
                    clause.on(field,abscissas[i])
                })
            )
            .then(list=>
                list.map(abscissa=>Abscissa.build(abscissa))
            )
    }

    ordinatesByAbscissa=(linked=new Linking())=>{
        const Ordinate = linked.Ordinate
        const keys = Object.keys(linked.ordinateKey)

        const fields = keys.map(key=>`${this.#name}.${key}`)
        const ordinates = keys.map(key=>`${Ordinate.name}.${key}`)

        return this.myContext()
            .where(linked.abscissaKey)
            .select(fields)
            .join(Ordinate.name,clause=>
                fields.forEach((field,i)=>{
                    clause.on(field,ordinates[i])
                })
            )
            .then(list=>
                list.map(ordinate=>Ordinate.build(ordinate))
            )
    }

}