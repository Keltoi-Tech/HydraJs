const { default: Context } = require("../repository/db/context");

class Handler {
    #context
    constructor({ context = new Context }) {
        this.#context = context;
    }

    get context(){
        return this.#context
    }

    handle(){}
    handleError({ code, message }) {
        return Promise.reject({ code, message });
    }
}

module.exports = Handler