// const express=require('express')
// const { getDb, connectToDb } = require('./db')

// // init app and middleware

// const app=express()

// // db connection
// let db

// connectToDb((err) => {   //its going to connect to db for us
//   if(!err){
//     app.listen('3000', () => {
//       console.log('app listening on port 3000')
//     })
//     db = getDb()  //going to return db connection object we need
//   }
// })


// // routes
// app.get('/books', (req, res)=>{
//     let books = []

//     db.collection('books')
//     // find all books
//       .find()            //find method returns us something as cursor. with use method on cursor we can do smth like foreach or toarray
//        //it fetch docuents in batches like 100 in each batch then it will fetch another batch    
//       .sort({author: 1})    //sort alphabetically by author name
//     //   cursor method
//       .forEach(book => books.push(book))
//       .then(() => {
//         res.status(200).json(books)   //sending books array back to client
//       })
//       .catch(() => {
//         res.status(500).json({error: 'Could not fetch the documents'})
//       })
// })



const express = require('express')
const { getDb, connectToDb } = require('./db')

// init app & middleware
const app = express()

// db connection
let db

connectToDb((err) => {
  if(!err){
    app.listen('3000', () => {
      console.log('app listening on port 3000')
    })
    db = getDb()
  }
})

// routes
app.get('/books', (req, res) => {
  let books = []

  db.collection('books')
    .find()
    .sort({author: 1})
    .forEach(book => books.push(book))
    .then(() => {
      res.status(200).json(books)
    })
    .catch(() => {
      res.status(500).json({error: 'Could not fetch the documents'})
    })
})
