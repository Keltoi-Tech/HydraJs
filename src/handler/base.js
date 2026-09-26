import { Result } from "../model";
import { DbContext } from "../repository/db";

export class Handler {
    #context
    constructor({ context = new DbContext }) {
        this.#context = context;
    }

    get context(){
        return this.#context
    }

    handle(){}
    handleError = ({ code, message }) => Promise.reject(new Result({ code, message }));
}
