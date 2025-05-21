import Repository from "./base";
import RestfulRepository from "./restful";
import Context from "./context";

const ApiRepository = Repository
const ApiContext = Context
const ApiRestfulRepository = RestfulRepository  

export { ApiContext, ApiRepository, ApiRestfulRepository };