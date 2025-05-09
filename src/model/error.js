class AppError {
    #code
    #message

    constructor({ code=0, message='' }) {
        this.#code = code
        this.#message = message
    }

    get view() {
        return {
            code: this.code,
            message: this.message
        }
    }

    get code() { return this.#code }
    get message() { return this.#message }


}

export default AppError