// require express and router
const express = require('express')
const router = express.Router()

// require ShortenUrl model
const ShortenUrl = require('../../models/shortenUrl')

// require body-parser
const bodyParser = require('body-parser')
router.use(express.urlencoded({ extended: true }))

// require url-exists-deep
const urlExistsDeep = require('url-exists-deep')

// set port
const port = 3000

// ******* route ******* //
// shorten page
router.post('/', (req, res) => {
  // get user input URL
  const originalUrl = req.body.URLinput

  // check if url exist
  urlExistsDeep(originalUrl)
    .then(respond => {
      if (!respond) {
        console.log('URL doesn\'t exist')
        res.redirect('/?url=' + originalUrl)
      }
    })

  // set shorten URL domin
  const urlDomin = `http://localhost:${port}/`

  // generate random shortenCode
  let shortenedUrl = ''
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const num = '1234567890'
  const codeSet = lowerCase + upperCase + num
  const maxLength = 5
  let shortenCode = ''
  let randomNum = 0
  for (let i = 1; i <= maxLength; i++) {
    randomNum = Math.floor(Math.random() * codeSet.length)
    shortenCode = shortenCode + codeSet[randomNum]
  }

  // find or insert in mongodb
  const query = { originalUrl }
  const insert = { originalUrl, shortenCode }
  const options = { upsert: true, new: true }
  ShortenUrl.findOneAndUpdate(
    query, { $setOnInsert: insert }, options
  )
    .lean()
    .then(result => res.render('shorten', { result, urlDomin }))
    .catch(error => console.error(error))
})

// export router
module.exports = router