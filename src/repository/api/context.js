import axios from "axios"

export default class Context{
    #http
    constructor(config=axios.create({})){
        this.#http = config
    }

    get http(){return this.#http}
}