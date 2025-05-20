import knex from "knex";
import { runWhenFalse } from "../../helper";
import { Entity } from "../../model";

export default class Migration{
    #db
    constructor(db = knex()) {
        this.#db = db
    }

    #get = ({ name='' })=>this
        .#db('migration')
        .where({ name })
        .first('iteration')
        .then(result=>!!result?result:{ iteration:0 })


    #update = ({ iteration=0,name='' })=>this
        .#db('migration')
        .where({ name })
        .update({ iteration })

    async runMigrations({ entity = Entity, migrations=[async ()=>{}] }){
        const name = entity.name

        const { iteration } = await this.#get(name)

        const listSize = migrations.length

        if (iteration >= listSize) return

        for (let index = iteration; index < listSize; index++) {
            await migrations[index]()
        }

        await this.#update({ iteration:listSize,name })
    }

    static structMe(db=knex()){
        return runWhenFalse(
            db.schema.hasTable('migration'),
            ()=>Promise.resolve(
                db.schema.createTable('migration', table => {
                    table.string('name',100)
                        .notNullable()
                        .unique();

                    table.integer('iteration')
                        .notNullable()
                        .unsigned()
                        .defaultTo(0);
                })
            )
        )
    }
}