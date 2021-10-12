// require express
const express = require('express')
const app = express()

// require body-parser
const bodyParser = require('body-parser')
app.use(express.urlencoded({ extended: true }))

// require mongoose
const mongoose = require('mongoose')
const db_URI = 'mongodb://localhost/URL-shortener'
mongoose.connect(db_URI)
const db = mongoose.connection

db.on('open', () => {
  console.log('Mongodb connected!')
})
db.once('error', () => {
  console.log('Mongodb error!')
})

// require shortenUrl model
const ShortenUrl = require('./models/shortenUrl')

// require handlebars
const exphbs = require('express-handlebars')
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')

// use static files
app.use(express.static('public'))

// set port
const port = 3000

// listen to localhost
app.listen(port, () => {
  console.log(`Express is listening to http://localhost:${port}`)
})

// ******** set route ******** //
// index page
app.get('/', (req, res) => {
  res.render('index')
})

// shorten page
app.post('/shorten', (req, res) => {
  const originalUrl = req.body.URLinput
  ShortenUrl.find(
    { 'originalUrl': { "$regex": originalUrl, "$options": "i" } }
  )
    .lean()
    .then(result => {
      const url = result[0]
      res.render('shorten', { url })
    })
    .catch(error => console.error(error))
})