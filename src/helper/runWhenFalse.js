export default (
        cond = Promise.resolve(true),
        execute = async () => {},
)=>cond
.then(async isTrue=>{
    if (!isTrue) await execute()
})