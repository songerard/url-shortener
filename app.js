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
  // get user input URL
  const originalUrl = req.body.URLinput

  // set shorten URL domin
  const urlDomin = 'http://heroku.com/'

  // generate random shorten part
  let shortenedUrl = ''
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const num = '1234567890'
  const codeSet = lowerCase + upperCase + num
  const maxLength = 5
  let shortenPart = ''
  let randomNum = 0
  for (let i = 1; i <= maxLength; i++) {
    randomNum = Math.floor(Math.random() * codeSet.length)
    shortenPart = shortenPart + codeSet[randomNum]
  }

  // combine shorten domain and shorten part
  shortenedUrl = urlDomin + shortenPart

  // find or insert in mongodb
  const query = { originalUrl }
  const insert = { originalUrl, shortenedUrl }
  const options = { upsert: true, new: true }
  ShortenUrl.findOneAndUpdate(
    query, { $setOnInsert: insert }, options
  )
    .lean()
    .then(result => res.render('shorten', { result }))
    .catch(error => console.error(error))
})