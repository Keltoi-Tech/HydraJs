
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

    createBatch = (linkings=[ new Linking() ])=>
        this.myContext()
            .insert(
                linkings.map(l => (
                    {
                        ...l.key,
                        ...l.entity
                    })
                )
            )
            .then(()=>linkings)

    create = (linked=new Linking())=>
        this.myContext()
            .insert({
                ...linked.key,
                ...linked.entity
            })
            .then(()=>linked);
    

    insertOrdinatesByAbscissa = ({ abscissa=new Model(),ordinates=[new Model()] })=>{
        const batch = ordinates
            .map(o=>this.#linking
                .build({abscissa,ordinate:o})
            )

        return this.createBatch(batch);
    }

    insertAbscissasByOrdinate = ({ ordinate=new Model(),abscissas=[new Model()] })=>{
        const batch = abscissas
            .map(a=>this.#linking
                .build({abscissa:a,ordinate})
            )

        return this.createBatch(batch)
    }

    delete = (linked=new Linking())=>
        this.myContext()
            .where(linked.key)
            .del()
            .then(affected=>affected > 0)
    

    getAbscissasByOrdinate(linked=new Linking()){
        const Abscissa = linked.Abscissa
        const Ordinate = linked.Ordinate
        const keys = Object.keys(linked.abscissaKey)
        const abscissaKey = Object.keys(linked.abscissa.key)

        const fields = keys.map(key=>`${Abscissa.name}${Ordinate.name}.${key}`)
        const abscissas = abscissaKey.map(key=>`${Abscissa.name}.${key}`)

        return this.myContext()
            .where(linked.ordinateKey)
            .select(`${Abscissa.name}.*`)
            .join(Abscissa.name,clause=>
                fields.forEach((field,i)=>{
                    clause.on(field,abscissas[i])
                })
            )
            .then(list=>
                list.map(abscissa=>Abscissa.build(abscissa))
            )
    }

    getOrdinatesByAbscissa(linked=new Linking()){
        const Ordinate = linked.Ordinate
        const Abscissa = linked.Abscissa
        const keys = Object.keys(linked.ordinateKey)
        const ordinateKeys = Object.keys(linked.ordinate.key)

        const fields = keys.map(key=>`${Abscissa.name}${Ordinate.name}.${key}`)
        const ordinates = ordinateKeys.map(key=>`${Ordinate.name}.${key}`)

        return this.myContext()
            .where(linked.abscissaKey)
            .select(`${Ordinate.name}.*`)
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