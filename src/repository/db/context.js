import knex from "knex"
import Migration from "./migration"
import { Model } from "../../model"

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

    async terraform(models=[Model]){
        await Migration.structMe(this.#db);

        const migration = new Migration(this.#db)

        const promises = models.map(model=>
            model.structMe(this.#db)
                .then(()=>migration
                    .runMigrations({ entity: model, migrations: model.migrations(this.#db) })
                )
        )        

        await Promise.all(promises)
    }
}