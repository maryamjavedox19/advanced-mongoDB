const express=require('express')
const { getDb, connectToDb } = require('./db')
const { ObjectId } = require('mongodb')   //bcs we are using objectID from mongo db
 


// init app and middleware

const app=express()

app.use(express.json())   //pass any json coming in on req so we can use it inside handler


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

   // current page
   const page = req.query.p || 0  //if page parameter doesn't have value then value should be 0(first page)
   const booksPerPage = 3

    let books = []

    db.collection('books')
    // find all books
      .find()            //find method returns us something as cursor. with use method on cursor we can do smth like foreach or toarray
       //it fetch docuents in batches like 100 in each batch then it will fetch another batch    
      .sort({author: 1})    //sort alphabetically by author name
      .skip(page * booksPerPage)   //so it would skip 3 pages bcs we have already showed 3 pages now it will show rest
      .limit(booksPerPage)    //rest of 3

    //   cursor method
      .forEach(book => books.push(book))
      .then(() => {
        res.status(200).json(books)   //sending books array back to client
      })
      .catch(() => {
        res.status(500).json({error: 'Could not fetch the documents'})
      })
})


app.get('/books/:id', (req, res) => {

  if (ObjectId.isValid(req.params.id)) {   
   
    db.collection('books')
      .findOne({_id: new ObjectId(req.params.id)})
      .then(doc => {
        res.status(200).json(doc)
      })
      .catch(err => {
        res.status(500).json({error: 'Could not fetch the document'})
      })
      
  } else {
    res.status(500).json({error: 'Could not fetch the document'})
  }

})


app.post('/books', (req, res) => {
  const book = req.body

  db.collection('books')
    .insertOne(book)
    .then(result => {    //result we get from mongodb
      res.status(201).json(result)
    })
    .catch(err => {
      res.status(500).json({err: 'Could not create new document'})
    })
})


app.delete('/books/:id', (req, res) => {

  if (ObjectId.isValid(req.params.id)) {

  db.collection('books')
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({error: 'Could not delete document'})
    })

  } else {
    res.status(500).json({error: 'Could not delete document'})
  }
})


// updating doc
app.patch('/books/:id', (req, res) => {
  const updates = req.body    //updates is going to be key value pair

  if (ObjectId.isValid(req.params.id)) {

    db.collection('books')
      .updateOne({ _id: new ObjectId(req.params.id) }, {$set: updates})   
      .then(result => {
        res.status(200).json(result)
      })
      .catch(err => {
        res.status(500).json({error: 'Could not update document'})
      })

  } else {
    res.status(500).json({error: 'Could not update document'})
  }
})


