class Result {
    #code
    #message
    #data

    constructor({ code=0, message='', data={} }) {
        this.#code = code
        this.#message = message
        this.#data = data
    }

    get error() {
        return {
            code: this.code,
            message: this.message
        }
    }

    get ok() {
        return {
            code: this.code,
            data: this.data
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
}

export default Result