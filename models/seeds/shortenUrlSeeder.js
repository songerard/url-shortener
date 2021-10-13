// require ShortenUrl model
const ShortenUrl = require('../shortenUrl')

// require mongoose
const mongoose = require('mongoose')

// mongodb connection
const db_URI = 'mongodb://localhost/URL-shortener'
mongoose.connect(db_URI)
const db = mongoose.connection

db.once('error', () => {
  console.log('Mongodb error!')
})

// create seeds
const seed = {
  originalUrl: 'http://www.google.com',
  shortenCode: 'abcde'
}

db.once('open', () => {
  console.log('Mongodb connected for seeder!')
  ShortenUrl.create(seed)
  console.log('seeder done')
})
