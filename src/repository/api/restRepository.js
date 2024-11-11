import Model from "../../model/index.js"
import Context from "./context.js"
import Repository from "./index.js"


export default class RestRepository extends Repository{
    constructor(model=Model,context=new Context()){
        super(model,context)
    }

    #httpGet=(route='',query={}|undefined)=>this.context
        .http
        .get(!! query ? `${route}${Repository.queryString(query)}` : route)

    get=(route='',query={}|undefined)=>this.#httpGet(route,query).then(value=>this.modelInstance(value))

    list=(route='',query={}|undefined)=>this.#httpGet(route,query).then((values=[])=>values.map(value=>this.modelInstance(value)))

    create=(route='',model=new Model())=>this.context.http.post(route,model.entity)

    update=(route='',model=new Model())=>this.context.http.put(route,model.entity)

    change=(route='',model=new Model())=>this.context.http.patch(route,model.entity)

    delete=(id,model=new Model())=>this.context.http.delete(`/${id}`)
}