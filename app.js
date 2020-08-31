const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
const {MONGOURI} = require('./config/keys')




//6VxsQWfUuLqwxmSx
mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', ()=>{
    console.log("connected to mongo  yeahh")
})
mongoose.connection.on('error', ()=>{
    console.log("err connecting", err)
})

require("./models/user")
require("./models/post")

app.use(express.json())   //pass incoming request and pass it as json
app.use(require('./routes/auth'))  //registering routes
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=="production"){  //for node to get static js and css file to get while production/deployment 
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*", (req, res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT, ()=>{
    console.log('server is running on',PORT)
})