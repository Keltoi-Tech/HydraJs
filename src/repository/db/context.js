import knex from "knex"

export default class Context{
    #db

    constructor(database=knex()){
        this.#db= database
    }

    get db(){return this.#db}

    unitOfWork(...repositories){
        return this.#db.transaction().then(trx=>{
            repositories.forEach(repo=>repo.context = trx)

            const clean =()=>repositories.forEach(repo=>
                repo.resetContext()
            )

            return {
                done:()=>trx.commit().then(clean),
                rollback:()=>trx.rollback().then(clean)
            }
        })
    }

    static instance(database=knex()){ return new Context(database) }

    async terraform(models=[]){
        const promises = models.map(async model=>{
            const exists = await this.#db
                .schema
                .hasTable(model.name)
                
            if (!exists) await model.makeMe(this.#db)
        })

        await Promise.all(promises)
    }
}