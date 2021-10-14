// require express
const express = require('express')
const app = express()

// require router
const routes = require('./routes')
app.use(routes)

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

// // require url-exists-deep
// const urlExistsDeep = require('url-exists-deep')

// set port
const port = 3000

// listen to localhost
app.listen(port, () => {
  console.log(`Express is listening to http://localhost:${port}`)
})

// ******** set route ******** //
// // index page
// app.get('/', (req, res) => {
//   const urlInQuery = req.query.url
//   const isInvalid = (!urlInQuery) ? false : true
//   const urlDomin = `http://localhost:${port}/`
//   res.render('index', { urlInQuery, isInvalid, urlDomin })
// })

// // shorten page
// app.post('/shorten', (req, res) => {
//   // get user input URL
//   const originalUrl = req.body.URLinput

//   // check if url exist
//   urlExistsDeep(originalUrl)
//     .then(respond => {
//       if (!respond) {
//         console.log('URL doesn\'t exist')
//         res.redirect('/?url=' + originalUrl)
//       }
//     })

//   // set shorten URL domin
//   const urlDomin = `http://localhost:${port}/`

//   // generate random shortenCode
//   let shortenedUrl = ''
//   const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
//   const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
//   const num = '1234567890'
//   const codeSet = lowerCase + upperCase + num
//   const maxLength = 5
//   let shortenCode = ''
//   let randomNum = 0
//   for (let i = 1; i <= maxLength; i++) {
//     randomNum = Math.floor(Math.random() * codeSet.length)
//     shortenCode = shortenCode + codeSet[randomNum]
//   }

//   // find or insert in mongodb
//   const query = { originalUrl }
//   const insert = { originalUrl, shortenCode }
//   const options = { upsert: true, new: true }
//   ShortenUrl.findOneAndUpdate(
//     query, { $setOnInsert: insert }, options
//   )
//     .lean()
//     .then(result => res.render('shorten', { result, urlDomin }))
//     .catch(error => console.error(error))
// })

// // redirect shortened url request
// app.get('/:shortenCode', (req, res) => {
//   const shortenCode = req.params.shortenCode
//   ShortenUrl.find(
//     { 'shortenCode': { "$regex": shortenCode } }
//   )
//     .lean()
//     .then(result => {
//       if (result.length) {
//         const { originalUrl, shortenCode } = result[0]
//         res.redirect(originalUrl)
//       } else {
//         res.render('error', { shortenCode })
//       }
//     })
//     .catch(error => console.error(error))
// })