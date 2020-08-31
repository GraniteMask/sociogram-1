// module.exports={
//     MONGOURI: "mongodb+srv://rd:6VxsQWfUuLqwxmSx@cluster0.af9qu.mongodb.net/<dbname>?retryWrites=true&w=majority",
//     JWT_SECRET:"sdfasasfdcefhouinxakzbbys4"
// }

//above code was before deployment

//below code is after deployment

if(process.env.NODE_ENV==='production'){
    module.exports = require('./prod')
}
else{
    module.exports = require('./dev')
}