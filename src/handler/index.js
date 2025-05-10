import Result from "../model/result";
import Context from "../repository/db/context";

export default class Handler {
    #context
    constructor({ context = new Context }) {
        this.#context = context;
    }

    get context(){
        return this.#context
    }

    handle(){}
    handleError({ code, message }) {
        return Promise.reject(new Result({ code, message }));
    }
}
