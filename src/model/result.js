class Result {
    #code
    #message
    #data

    constructor({ code=0, message='', data={} }) {
        this.#code = code
        this.#message = message
        this.#data = data
    }

    get isError() {
        return this.#code > 299
    }

    get error() {
        return {
            code: this.#code,
            message: this.#message
        }
    }

    get ok() {
        return {
            code: this.#code,
            data: this.#data
        }
    }

    sendError(res) { 
        res
            .status(this.#code)
            .send(this.#message) 
    }

    sendOk(res) { 
        res
            .status(this.#code)
            .json(this.#data)
    }

    static createInstance = (err)=>
        (err instanceof Result)
            ? Promise.reject(err)
            : Promise.reject(
                !!err.message
                    ? new Result({
                        code:500,
                        message:err.message
                        })
                    : new Result({
                        code:500,
                        data:err,
                        message:'Server error'
                        })
                )
}

export default Result