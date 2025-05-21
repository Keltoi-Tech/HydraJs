
import Context from "./context";
import { Entity, Linking, Result } from "../../model";


export default class DbLinked {
    #linking
    #name=''

    myContext

    constructor(link=Linking,context=new Context){
        this.#name  = link.name
        this.myContext = () => context.db(this.#name)
        this.#linking = link
    }

    insertBatch = (linkings=[ new Linking() ])=>
        this.myContext()
            .insert(
                linkings.map(l => (
                    {
                        ...l.key,
                        ...l.entity
                    })
                )
            )
            .then(()=>new Result({data:linkings}))
            .catch(err=>Promise.reject(new Result({code:500,message:err})));

    insert = (linked=new Linking())=>   
        this.myContext()
            .insert({
                ...linked.key,
                ...linked.entity
            })
            .then(()=>new Result({data:linked}))
            .catch(err=>Promise.reject(new Result({code:500,message:err})));
    

    insertOrdinatesByAbscissa = ({ abscissa=new Entity(),ordinates=[new Entity()] })=>{
        const batch = ordinates
            .map(o=>this.#linking
                .build({abscissa,ordinate:o})
            )

        return this.insertBatch(batch);
    }

    insertAbscissasByOrdinate = ({ ordinate=new Entity(),abscissas=[new Entity()] })=>{
        const batch = abscissas
            .map(a=>this.#linking
                .build({abscissa:a,ordinate})
            )

        return this.insertBatch(batch)
    }

    delete = (linked=new Linking())=>
        this.myContext()
            .where(linked.key)
            .del()
            .then(affected=>new Result({data:affected}))
            .catch(err=>Promise.reject(new Result({code:500,message:err})))
    

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
            .then(result=>new Result({data:result}))
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
            .then(result=>new Result({data:result}))
    }

}