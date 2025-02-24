"use strict";var e=require("knex"),t=require("axios");class Model{#e;constructor(e={}){this.#e=e}get key(){return this.#e}set key(e={}){this.#e=e}get entity(){return{}}static build(e={}){return new Model(e)}}class Logged extends Model{#t=new Date;#n=void 0|new Date;#s=!0;constructor({key:e={},createdAt:t=new Date,updatedAt:n=void 0|new Date,active:s=!0}){super(e),this.#s=s,this.#n=n,this.#t=t}get createdAt(){return this.#t}set createdAt(e=new Date){this.createdAt=e}get updatedAt(){return this.#n}set updatedAt(e=new Date){this.#n=e}get active(){return this.#s}set active(e=!0){this.#s=e}static makeMe(t=e(),n=Model,s=(t=new e.TableBuilder)=>{}){return t.schema.createTable(n.name,(e=>{s(e),e.dateTime("createdAt").notNullable().defaultTo(t.fn.now()),e.dateTime("updatedAt").nullable(),e.boolean("active").defaultTo(!0)}))}}class Linking{#i=new Model;#a=new Model;#o=Model;#r=Model;get Abscissa(){return this.#o}get Ordinate(){return this.#r}static build=({abscissa:e=new Model,ordinate:t=new Model})=>new Linking(Model,Model,{abscissa:e,ordinate:t});constructor(e=Model,t=Model,{abscissa:n=e.build(),ordinate:s=t.build()}){this.#o=e,this.#r=t,this.#i=n,this.#a=s}static makeMe(t=e(),n=Model,s=Model,i=(t=new e.TableBuilder)=>{}){return t.schema.createTable(`${n.name}${s.name}`,(e=>{i(e)}))}get abscissaKey(){return{idAbscissa:this.#i.key.id}}get ordinateKey(){return{idOrdinate:this.#a.key.id}}get key(){return{...this.abscissaKey,...this.ordinateKey}}get abscissa(){return this.#i}set abscissa(e=new Model){this.#i=e}get ordinate(){return this.#a}set ordinate(e=new Model){this.ordinate=e}}class Thing extends Model{#d;constructor({key:e={},name:t=""}){super(e),this.#d=t}get name(){return this.#d}set name(e=""){this.#d=e}get entity(){return{name:this.#d}}static makeMe(t=e(),n=Thing,s=(t=new e.TableBuilder)=>{}){return t.schema.createTable(n.name,(e=>{s(e),e.string(255).notNullable()}))}}let n=class Context{#h;constructor(t=e()){this.#h=t}get db(){return this.#h}unitOfWork(...e){return this.#h.transaction().then((t=>{e.forEach((e=>e.context=t));const clean=()=>e.forEach((e=>e.resetContext()));return{done:()=>t.commit().then(clean),rollback:()=>t.rollback().then(clean)}}))}static instance(t=e()){return new Context(t)}async terraform(e=[]){const t=e.map((async e=>{await this.#h.schema.hasTable(e.name)||await e.makeMe(this.#h)}));await Promise.all(t)}},s=class Repository{#d="";myContext;static anyOrError(e,t={code:0,message:""}){if(e)return e;throw t}static setOrEmpty(e=[],t=e=>e){return e.length?e.map(t):[]}constructor(e=Model,t=new n){this.#d=e.name,this.myContext=()=>t.db(this.#d),this.resetContext=()=>{this.myContext=()=>t.db(this.#d)},this.modelInstance=(t={})=>e.build(t)}set context(t=e()){this.myContext=()=>t(this.#d)}insert=(e=new Model)=>this.myContext().insert(e.entity,Object.keys(e.key)).then((t=>e.key=t[0])).then((()=>e));update=(e=new Model)=>this.myContext().where(e.key).update(e.entity).then((e=>e>0));delete=(e={})=>this.myContext().where(e).del().then((e=>e>0));get=(e={})=>this.myContext().where(e).first().then((e=>Repository.anyOrError(e,{code:404,message:"Not found"}))).then(this.modelInstance);list=()=>this.myContext().select().then((e=>Repository.setOrEmpty(e,this.modelInstance)))};class Context{#c;constructor(e=t.create({})){this.#c=e}get http(){return this.#c}}class Repository{#l;constructor(e=Model,t=new Context){this.#l=t,this.modelInstance=(t={})=>new e(t)}static queryString(e={}){return"?"+Object.entries(e).map((([e,t])=>`${e}=${t}`)).join("&")}get context(){return this.#l}}exports.ApiContext=Context,exports.ApiRepository=Repository,exports.ApiRestRepository=class RestRepository extends Repository{constructor(e=Model,t=new Context){super(e,t)}#m=(e="",t=void 0|{})=>this.context.http.get(t?`${e}${Repository.queryString(t)}`:e);get=(e="",t=void 0|{})=>this.#m(e,t).then((e=>this.modelInstance(e)));list=(e="",t=void 0|{})=>this.#m(e,t).then(((e=[])=>e.map((e=>this.modelInstance(e)))));create=(e="",t=new Model)=>this.context.http.post(e,t.entity);update=(e="",t=new Model)=>this.context.http.put(e,t.entity);change=(e="",t=new Model)=>this.context.http.patch(e,t.entity);delete=(e,t=new Model)=>this.context.http.delete(`/${e}`)},exports.DbContext=n,exports.DbLinked=class DbLinked{#u;#d="";myContext;constructor(e=Linking,t=new n){this.#d=e.name,this.myContext=()=>t.db(this.#d),this.#u=e}#y=(e=[new Linking])=>this.myContext().insert(e.map((e=>e.key()))).then((()=>e));insert=(e=new Linking)=>{const t=e.key();return this.myContext().insert(t).then((()=>t))};insertOrdinatesByAbscissa=(e=new Model,t=[new Model])=>{const n=t.map((t=>this.#u.build({abscissa:e,o:t})));return this.#y(n)};insertAbscissasByOrdinate=(e=new Model,t=[new Model])=>{const n=t.map((t=>this.#u.build({a:t,ordinate:e})));return this.#y(n)};delete=(e=new Linking)=>this.myContext().where(e.key()).del().then((e=>e>0));abscissasByOrdinate=(e=new Linking)=>{const t=e.Abscissa,n=Object.keys(e.abscissaKey),s=n.map((e=>`${this.#d}.${e}`)),i=n.map((e=>`${t.name}.${e}`));return this.myContext().where(e.ordinateKey).select(s).join(t.name,(e=>s.forEach(((t,n)=>{e.on(t,i[n])})))).then((e=>e.map((e=>t.build(e)))))};ordinatesByAbscissa=(e=new Linking)=>{const t=e.Ordinate,n=Object.keys(e.ordinateKey),s=n.map((e=>`${this.#d}.${e}`)),i=n.map((e=>`${t.name}.${e}`));return this.myContext().where(e.abscissaKey).select(s).join(t.name,(e=>s.forEach(((t,n)=>{e.on(t,i[n])})))).then((e=>e.map((e=>t.build(e)))))}},exports.DbLoggedRepository=class LoggedRepository extends s{constructor(e=Logged,t=new n){super(e,t)}deceased=()=>this.myContext().where({active:!1}).select().then((e=>e.map(this.modelInstance)));get=(e={})=>this.myContext().where({...e,active:!0}).first().then(this.modelInstance);before=(e=new Date)=>this.myContext().where("createdAt","<",e.toISOString()).select().then((e=>e.map(this.modelInstance)));after=(e=new Date)=>this.myContext().where("createdAt",">",e.toISOString()).select().then((e=>e.map(this.modelInstance)));list=()=>this.myContext().select().orderBy("createdAt","updatedAt").where({active:!0}).then((e=>e.map(this.modelInstance)));update=(e=new Logged)=>this.myContext().where(e.key).update({...e.entity,updatedAt:new Date}).then((e=>e>0));delete=(e={})=>this.myContext().where(e).update({updatedAt:(new Date).toISOString(),active:!1}).then((e=>e>0))},exports.DbRepository=s,exports.DbThingRepository=class ThingRepository extends s{constructor(e=new n){super(model=Thing,e)}getByName=(e="")=>this.myContext().where({name:e}).select().then((e=>this.modelInstance(e)))},exports.Linking=Linking,exports.Logged=Logged,exports.Model=Model,exports.Thing=Thing;
