import { Result } from '../model'
import jwt from 'jsonwebtoken'

export class JwtHandler {
    #jwt
    constructor({ jwt }){
        this.#jwt = jwt
    }

    #verifyJwt(token=''){
        const { issuer, secret } = this.#jwt
        const bearer = token.split(' ')[1]

        return jwt.verify(bearer,secret,{issuer})
    }

    #mustValidate(){
        const { validate } = this.#jwt

        return !!validate && validate == 'true'
    }

    #verifyRole(access={feature:'',access:''},payload){
        const permissions = payload.access[access.feature]

        if (!permissions) return false

        return permissions.includes(access.access)
    }

    async handle({ token='', access={feature:'',access:''} }){
        try{
            if (!this.#mustValidate()) return new Result({code:201})

            const payload = this.#verifyJwt(token)

            if (!payload) return new Result({code:401,message:'Unauthorized'})

            if (!this.#verifyRole(access,payload)) return new Result({code:403,message:'Forbidden'})
            
        } catch (error) {
            return new Result({code:401,message:'Unauthorized'})
        }
    }
}