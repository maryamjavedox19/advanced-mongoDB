const express=require('express')
const { getDb, connectToDb } = require('./db')

// init app and middleware

const app=express()

// db connection
let db

connectToDb((err) => {   //its going to connect to db for us
  if(!err){
    app.listen('3000', () => {
      console.log('app listening on port 3000')
    })
    db = getDb()  //going to return db connection object we need
  }
})


// routes
app.get('/books', (req, res)=>{
    res.json({msg:"welcome to api"})
})