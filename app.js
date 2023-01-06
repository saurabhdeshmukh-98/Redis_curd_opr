const express=require('express')
const app=express()
const cors=require('cors')
const bodyParser=require('body-parser')
require('dotenv').config()
const router = require('./router/router')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use('/',router)

 function init() {
    app.listen(process.env.PORT, () => {         
        console.log(`listening on port ${process.env.PORT}`); 
    });
}
init();