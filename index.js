import knex from 'knex';
import axios from 'axios';

var runWhenFalse = (
        cond = Promise.resolve(true),
        execute = async () => {},
)=>cond
.then(async isTrue=>{
    if (!isTrue) await execute();
});

var runWhenTrue = (
        cond = Promise.resolve(true),
        execute = async () => {},
)=>cond
.then(async isTrue=>{
    if (isTrue) await execute();
});

class Result {
    #code
    #message
    #data

    constructor({ code=0, message='', data={} }) {
        this.#code = code;
        this.#message = message;
        this.#data = data;
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
            .send(this.#message); 
    }

    sendOk(res) { 
        res
            .status(this.#code)
            .json(this.#data);
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

class Entity{
    #key
    #data

    constructor(key={},data={}){
        this.#data = data;
        this.#key = key;
    }

    get key(){ return this.#key }
    get data(){ return this.#data }

    set key(value = {}){ this.#key = value; }

    get $(){ 
        return { ...this.#key, ...this.#data }
    }

    static migrations(){ return [] }

    static structMe(db=knex()){
        throw new Error('Abstract class cant be instantiated')
    }

    static build({ }){
        throw new Error('Abstract class cant be instantiated')
    }

    static fromResult(result=new Result()){
        if(result.isError) return Promise.reject(result)
    }   

    static collectionFromResult(result=new Result()){
        if(result.isError) return Promise.reject(result)
    }
}

class Model {
    constructor() {}

    static fromEntity(entity = new Entity()) {
        return new Model(entity.$)
    }

    validate(){}
}

class Linking{
    #abscissa=new Entity()
    #ordinate=new Entity()
    #AbscissaEntity=Entity
    #OrdinateEntity=Entity

    static get name(){ return null }

    get Abscissa(){
        return this.#AbscissaEntity
    }

    get Ordinate(){
        return this.#OrdinateEntity
    }

    constructor(
        AbscissaEntity=Entity,
        OrdinateEntity=Entity,
        {
            abscissa=new AbscissaEntity(),
            ordinate=new OrdinateEntity()
        })
    {
        this.#AbscissaEntity = AbscissaEntity;
        this.#OrdinateEntity = OrdinateEntity;

        this.#abscissa = abscissa;
        this.#ordinate = ordinate;
    }

    static build=({
        AbscissaEntity=Entity,
        OrdinateEntity=Entity,
        abscissa=new Entity(),
        ordinate=new Entity()
    })=>new Linking(AbscissaEntity,OrdinateEntity,{abscissa,ordinate})

    static structMe(
        db=knex(),
        abscissa=Entity,
        ordinate=Entity,
        schema=(t)=>{}
    ){
        const tableName = this.name ?? `${abscissa.name}${ordinate.name}`;

        return runWhenFalse(
            db.schema.hasTable(tableName),
            () => Promise.resolve(
                db.schema.createTable(tableName, table=>{ schema(table); })
            )
        )
    }

    static migrations(){ return [] }

    get abscissaKey(){
        return { idAbscissa: this.#abscissa.key }
    }

    get ordinateKey(){
        return { idOrdinate: this.#ordinate.key }
    }

    get $(){
        return {
            ...this.abscissaKey,
            ...this.ordinateKey
        }
    }

    get entity(){}

    get abscissa(){ return this.#abscissa }
    set abscissa(value = this.Abscissa.build()){ this.#abscissa = value; }

    get ordinate(){ return this.#ordinate }
    set ordinate(value = this.Ordinate.build()){ this.ordinate = value; }

}

class Traceable extends Entity{
    #createdAt
    constructor({
        key={},
        struct={},
        createdAt=new Date()
    }){
        super(key,struct);

        this.#createdAt = createdAt;
    } 

    get createdAt(){ return this.#createdAt }

    static structMe(
        db=knex(),
        model=Traceable,
        schema=(t)=>{}
    ){
        return runWhenFalse(
            db.schema.hasTable(model.name),
            async ()=>Promise.resolve(
                db.schema.createTable(
                    model.name,
                    table=>{
                        table.dateTime('createdAt')
                            .notNullable()
                            .defaultTo(db.fn.now());

                        schema(table);
                    }
                )
            )
        )
    }
}

class Status extends Entity{
    static build=({ id=1,description='',data={} })=>new Status({id,description,data})

    static structMe( 
        db=knex(), 
        model=Status, 
        schema=(t)=>{} 
    ){
        return runWhenFalse(
            db.schema.hasTable(model.name),
            ()=>Promise.resolve(
                db.schema.createTable(
                    model.name,
                    table=>{
                        table.increments();

                        table
                            .string('status',50)
                            .notNullable()
                            .unique();

                        schema(table);
                    }
                )
            )
        )
    }

    constructor({ id=1, description='', data={}}){
        super({ id }, { status:description, ...data });
    }

    get description(){ return this.data.status }
    set description( value='' ){ this.data.status = value;}
}

class Thing extends Entity{
    constructor({
        key={},
        name='',
        struct={}
    }){
        super(key,{ name, ...struct });
    }

    get name(){ return this.data.name }
    set name(value=''){ this.data.name = value; }    

    static structMe(
        db=knex(),
        thing=Thing,
        size = 255,
        schema=(t)=>{}
    ){
        return runWhenFalse(
            db.schema.hasTable(thing.name),
            ()=>Promise.resolve(
                db.schema.createTable(
                    thing.name,
                    table=>{
                        table.string('name',size)
                            .notNullable();

                        schema(table);
                    }
                )
            )
        )
    }
}

class Changeable extends Entity{
    #createdAt
    #updatedAt  
    #active

    constructor({
        key={},
        struct = {},
        createdAt=new Date(),
        updatedAt=new Date()|undefined,
        active=true
    }){
        super(
            key,
            struct
        );

        this.#createdAt = createdAt;
        this.#updatedAt = updatedAt;
        this.#active = active;
    }

    get createdAt(){ return this.createdAt }
    get updatedAt(){ return this.updatedAt }
    get active(){ return this.active }

    get change(){
        return {
            updatedAt: this.updatedAt
        }
    }

    static structMe(
        db=knex(),
        model=Changeable,
        schema=(t)=>{}
    ){
        return runWhenFalse(
            db.schema.hasTable(model.name),
            ()=>Promise.resolve(
                db.schema.createTable(model.name,table=>{
                    table.dateTime('createdAt')
                        .notNullable()
                        .defaultTo(db.fn.now());

                    table.dateTime('updatedAt')
                        .nullable();

                    table.boolean('active')
                        .defaultTo(true);

                    schema(table);
                })
            )
        )
    }
}

class Migration{
    #db
    constructor(db = knex()) {
        this.#db = db;
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
        .then(affected=>{
            if (affected == 0) return this
                .#db('migration')
                .insert({ iteration,name })
        })

    async runMigrations({ entity = Entity, migrations=[async ()=>{}] }){
        try{
            const name = entity.name;

            const { iteration } = await this.#get({ name });

            const listSize = migrations.length;

            if (iteration >= listSize) return

            for (let index = iteration; index < listSize; index++) await migrations[index]();

            await this.#update({ iteration:listSize,name });
        } catch(err){

            console.error(err);
        }
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

let Context$2 = class Context{
    #db

    constructor(database=knex()){
        this.#db= database;
    }

    get db(){return this.#db}

    unitOfWork(...repositories){
        return this.#db.transaction().then(trx=>{
            repositories.forEach(repo=>repo.context = trx);

            const clean =()=>repositories.forEach(repo=>
                repo.resetContext()
            );

            return {
                done:()=>trx.commit().then(clean),
                rollback:()=>trx.rollback().then(clean)
            }
        })
    }

    static instance(database=knex()){ return new Context(database) }

    async terraform(models=[Model]){
        await Migration.structMe(this.#db);

        const migration = new Migration(this.#db);

        const promises = models.map(model=>
            model
                .structMe(this.#db)
                .then(()=>migration
                    .runMigrations({ 
                        entity: model, 
                        migrations: model.migrations(this.#db) 
                    })
                )
        );        

        await Promise.all(promises);
    }
};

let Repository$1 = class Repository{
    #name='';

    myContext

    get name(){ return this.#name }

    constructor(entity=Entity,context=new Context$2())
    {
        this.#name = entity.name;

        this.myContext=()=>context.db(this.#name);

        this.resetContext=()=>{
            this.myContext=()=>context.db(this.#name);
        };
    }

    set context(value=knex()){ this.myContext=()=>value(this.#name); }

    insert = (entity = new Entity())=>
        this.myContext()
            .insert(entity.$)
            .then(()=>new Result({data:entity}))
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    create = (entity = new Entity())=>
        this.myContext()
            .insert(entity.data,Object.keys(entity.key))
            .then(ids=>{
                entity.key = ids[0];

                return new Result({  data:entity })
            })
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    update = (entity = new Entity())=>
        this.myContext()
            .where(entity.key)
            .update(entity.data)
            .then(affected=> affected > 0 
                ? new Result({ code:200,data:`${this.#name} updated` }) 
                : new Result({ code:404,message:'Not found' })
            )
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    delete = (entity = new Entity())=>
        this.myContext()
            .where(entity.key)
            .del()
            .then(affected=> affected > 0 
                ? new Result({ code:200,data:`${this.#name} deleted` })
                : new Result({ code:404,message:'Not found' })
            )
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    get = (entity = new Entity())=>
        this.myContext()
            .where(entity.key)
            .first()
            .then(Repository.resultModelOrError)

    list = ()=>
        this.myContext()
            .select()
            .then(models=>new Result({ data:models }))
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    static resultModelOrError(model){
        if (!!model) return new Result({ data:model })

        const error = new Result({code:404,message:'Not found'});

        return Promise.reject(error)
    }
};

class ChangeableRepository extends Repository$1{
    constructor(entity = Changeable,context=new Context$2()){
        super(entity,context);
    }

    insert = (entity = new Changeable())=>
        this.myContext()
            .insert({
                ...entity.$,
                createdAt:entity.createdAt,
                active:true
            })
            .then(()=>new Result({ data:entity }))
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    create = (entity = new Changeable())=>
        this.myContext()
            .insert({
                    ...entity.data,
                    active:true
                },
                Object.keys(entity.key)
            )
            .then(ids=>{
                entity.key = ids[0];

                return new Result({ data:entity })
            })
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    update = (entity = new Changeable())=>
        this.myContext()
            .where(entity.key)
            .update({
                ...entity.data,
                updatedAt:new Date()
            })
            .then(affected=> affected > 0 
                ? new Result({ code:200,data:`${this.name} updated` }) 
                : new Result({ code:404,message:'Not found' })
            )
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    reactive = (entity = new Changeable())=>
        this.myContext()
            .where(entity.key)
            .update({
                active:true, 
                updatedAt:new Date()
            })
            .then(affected=> affected > 0 
                ? new Result({ code:200,data:`${this.name} updated` }) 
                : new Result({ code:404,message:'Not found' })
            )
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    remove = (entity = new Changeable())=>
        this.myContext()
            .where(entity.key)
            .update({
                active:false,
                updatedAt:new Date()
            })
            .then(affected=> affected > 0 
                ? new Result({ code:200,data:`${this.name} updated` }) 
                : new Result({ code:404,message:'Not found' })
            )
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    deceased = (order = 'asc') =>
        this.myContext()
            .where({active:false})
            .select()
            .orderBy(['createdAt','updatedAt'],order)
            .then(result => new Result({data:result}))
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    before = (date = new Date(), order = 'asc') =>
        this.myContext()
            .where('createdAt','<',date.toISOString())
            .where({active:true})
            .select()
            .orderBy(['createdAt','updatedAt'],order)
            .then(result => new Result({data:result}))
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))            

    after = (date=new Date(), order = 'asc') =>
        this.myContext()
            .where('createdAt','>',date.toISOString())
            .where({active:true})
            .select()
            .orderBy(['createdAt','updatedAt'],order)
            .then(result => new Result({data:result}))
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    list = (order = 'asc') =>
        this.myContext()
            .where({active:true})
            .select()
            .orderBy(['createdAt','updatedAt'],order)
            .then(result => new Result({data:result}))
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))

    last = () =>
        this.myContext()
            .where({active:true})
            .first()
            .orderBy('createdAt',"desc")
            .then(Repository$1.resultModelOrError)

    first = () =>
        this.myContext()
            .where({active:true})
            .first()
            .orderBy('createdAt',"asc")
            .then(Repository$1.resultModelOrError)
}

class TraceableRepository extends Repository$1{
    constructor(entity=Traceable,context=new Context$2()){
        super(entity,context);
    }

    get = (traceable = new Traceable()) =>
        this.myContext()
            .where(traceable.key)
            .first()
            .then(Repository$1.resultModelOrError)
            .catch(err=>Promise.reject( new Result({code:500,message:err})) )

    before = (date = new Date(), order = 'asc') =>
        this.myContext()
            .where('createdAt','<',date.toISOString())
            .select()
            .orderBy('createdAt',order)
            .then(result => new Result({data:result}))
            .catch(err=>Promise.reject( new Result({code:500,message:err})) )

    after = (date = new Date(), order = 'asc') =>
        this.myContext()
            .where('createdAt','>',date.toISOString())
            .select()
            .orderBy('createdAt',order)
            .then(result => new Result({data:result}))
            .catch(err=>Promise.reject( new Result({code:500,message:err})) )

    list = (order='asc') =>
        this.myContext()
            .select()
            .orderBy('createdAt',order)
            .then(result => new Result({data:result}))
            .catch(err=>Promise.reject( new Result({code:500,message:err})) )

    insert = (entity = new Traceable()) =>
        this.myContext()
            .insert({
                ...entity.$,
                createdAt:entity.createdAt
            })
            .then(()=>new Result({ data:entity }))
            .catch(err=>Promise.reject( new Result({code:500,message:err})) )

    create = (entity = new Traceable()) =>
        this.myContext()
            .insert(
                {
                    ...entity.data,
                    createdAt:new Date()
                },
                Object.keys(entity.key)
            )
            .then(ids=>{
                entity.key = ids[0];

                return new Result({ data:entity })
            })
            .catch(err=>Promise.reject( new Result({code:500,message:err})) )

    update = () => Promise.reject( new Result({code:400,message:'Cannot update a logged object'}) )

    delete = () => Promise.reject( new Result({code:400,message:'Cannot delete a logged object'}) )
    
}

class ThingRepository extends Repository$1{
    constructor(entity = Thing,context=new Context()){
        super(entity,context);
    }

    getByName = (name='') =>
        this.myContext()
            .where({name})
            .first()
            .then(result=>!!result
                ?new Result({data:result})
                :new Result({code:404,message:'Not found'})
            )
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ))
}

class DbLinked {
    #linking
    #name=''

    myContext

    constructor(link=Linking,context=new Context$2){
        this.#name  = link.name;
        this.myContext = () => context.db(this.#name);
        this.#linking = link;
    }

    insertBatch = (linkings=[ new Linking() ])=>
        this.myContext()
            .insert(
                linkings.map(l => (
                    {
                        ...l.key,
                        ...l.entity
                    })
                )
            )
            .then(()=>new Result({data:linkings}))
            .catch(err=>Promise.reject(new Result({code:500,message:err})));

    insert = (linked=new Linking())=>   
        this.myContext()
            .insert({
                ...linked.key,
                ...linked.entity
            })
            .then(()=>new Result({data:linked}))
            .catch(err=>Promise.reject(new Result({code:500,message:err})));
    

    insertOrdinatesByAbscissa = ({ abscissa=new Entity(),ordinates=[new Entity()] })=>{
        const batch = ordinates
            .map(o=>this.#linking
                .build({abscissa,ordinate:o})
            );

        return this.insertBatch(batch);
    }

    insertAbscissasByOrdinate = ({ ordinate=new Entity(),abscissas=[new Entity()] })=>{
        const batch = abscissas
            .map(a=>this.#linking
                .build({abscissa:a,ordinate})
            );

        return this.insertBatch(batch)
    }

    delete = (linked=new Linking())=>
        this.myContext()
            .where(linked.key)
            .del()
            .then(affected=>
                affected > 0 
                    ?new Result({data:affected})
                    :new Result({code:404,message:'Not found'})
            )
            .catch(err=>Promise.reject(new Result({code:500,message:err})))
    

    getAbscissasByOrdinate(linked=new Linking()){
        const Abscissa = linked.Abscissa;
        const Ordinate = linked.Ordinate;
        const keys = Object.keys(linked.abscissaKey);
        const abscissaKey = Object.keys(linked.abscissa.key);

        const fields = keys.map(key=>`${Abscissa.name}${Ordinate.name}.${key}`);
        const abscissas = abscissaKey.map(key=>`${Abscissa.name}.${key}`);

        return this.myContext()
            .where(linked.ordinateKey)
            .select(`${Abscissa.name}.*`)
            .join(Abscissa.name,clause=>
                fields.forEach((field,i)=>{
                    clause.on(field,abscissas[i]);
                })
            )
            .then(result=>new Result({data:result}))
            .catch(err=>Promise.reject(new Result({code:500,message:err})));
    }

    getOrdinatesByAbscissa(linked=new Linking()){
        const Ordinate = linked.Ordinate;
        const Abscissa = linked.Abscissa;
        const keys = Object.keys(linked.ordinateKey);
        const ordinateKeys = Object.keys(linked.ordinate.key);

        const fields = keys.map(key=>`${Abscissa.name}${Ordinate.name}.${key}`);
        const ordinates = ordinateKeys.map(key=>`${Ordinate.name}.${key}`);

        return this.myContext()
            .where(linked.abscissaKey)
            .select(`${Ordinate.name}.*`)
            .join(Ordinate.name,clause=>
                fields.forEach((field,i)=>{
                    clause.on(field,ordinates[i]);
                })
            )
            .then(result=>new Result({data:result}))
            .catch(err=>Promise.reject( new Result({code:500,message:err}) ));
    }

}

const DbRepository = Repository$1;
const DbContext = Context$2;
const DbChangeableRepository = ChangeableRepository;
const DbTraceableRepository = TraceableRepository;
const DbThingRepository = ThingRepository;

class Service {
    #context
    constructor(context=new DbContext()){
        this.#context = context;
    }

    get context(){return this.#context}    

    handleError = ({code,message})=> Promise.reject(new Result({code,message}))
}

class Handler {
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

let Context$1 = class Context{
    #http

    constructor(config=axios.create({})){
        this.#http = config;
    }

    get http(){ return this.#http }
};

class Repository {
    #context

    constructor(context=new Context$1()){
        this.#context = context;
    }

    static queryString(param={}){
        return '?' + Object.entries(param)
            .map(([k,v])=>`${k}=${v}`)
            .join('&')
    }

    get context(){ return this.#context }
}

class RestfulRepository extends Repository{
    constructor(context=new Context$1()){
        super(context);
    }

    #keysAsParams(route='',key={}){
        const params = Object.keys(key);

        params.forEach(param=>
            route = route.replace(`:${param}`,key[param])
        );        

        return route
    }

    #httpGet=(route='',query={}|undefined)=>this.context
        .http
        .get(!! query ? `${route}${Repository.queryString(query)}` : route)
        .then(value=>{
            value.status === 200 
                ? new Result({data:value.data}) 
                : Promise.reject(new Result({code:value.status, message:value.statusText}));
        })

    get=(route='',query={}|undefined)=>this.#httpGet(route,query)
        .then(value=>{
            value.status === 200 
                ? new Result({data:value.data}) 
                : Promise.reject(new Result({code:value.status, message:value.statusText}));
        })

    create=(route='',entity=new Entity())=>this.context
        .http
        .post(route,entity.data)
        .then(value=>{
            value.status === 201
                ? new Result({data:value.data}) 
                : Promise.reject(new Result({code:value.status, message:value.statusText}));
        })

    update=(route='',entity=new Entity())=>{
        const url = this.#keysAsParams(route,entity.key);

        return this.context
            .http
            .put(url,model.entity)
            .then(value=>{
                value.status === 200 
                    ? new Result({data:value.data}) 
                    : Promise.reject(new Result({code:value.status, message:value.statusText}));
            })
    }

    change=(route='',entity=new Entity())=>{
        const url = this.#keysAsParams(route,entity.key);

        return this.context
            .http
            .patch(url,model.entity)
            .then(value=>{
                value.status === 200 
                    ? new Result({data:value.data}) 
                    : Promise.reject(new Result({code:value.status, message:value.statusText}));
            })
    }

    delete=(route='',entity = new Entity())=>{
        const url = this.#keysAsParams(route,entity.key);

        return this.context
            .http
            .delete(url)
            .then(value=>{
                value.status === 200 
                    ? new Result({data:value.data}) 
                    : Promise.reject(new Result({code:value.status, message:value.statusText}));
            })
    }
}

const ApiRepository = Repository;
const ApiContext = Context$1;
const ApiRestfulRepository = RestfulRepository;

export { ApiContext, ApiRepository, ApiRestfulRepository, Changeable, DbChangeableRepository, DbContext, DbLinked, DbRepository, DbThingRepository, DbTraceableRepository, Entity, Handler, Linking, Migration, Model, Result, Service, Status, Thing, Traceable, runWhenFalse, runWhenTrue };
