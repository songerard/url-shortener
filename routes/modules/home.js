// require express and router
const express = require('express')
const router = express.Router()

// require ShortenUrl model
const ShortenUrl = require('../../models/shortenUrl')

// set port
const port = 3000

// ******* route ******* //
// index page
router.get('/', (req, res) => {
  const urlInQuery = req.query.url
  const isInvalid = (!urlInQuery) ? false : true
  const urlDomin = `http://localhost:${port}/`
  res.render('index', { urlInQuery, isInvalid, urlDomin })
})

// redirect shortened url request
router.get('/:shortenCode', (req, res) => {
  const shortenCode = req.params.shortenCode
  ShortenUrl.find(
    { 'shortenCode': { "$regex": shortenCode } }
  )
    .lean()
    .then(result => {
      if (result.length) {
        const { originalUrl, shortenCode } = result[0]
        res.redirect(originalUrl)
      } else {
        res.render('error', { shortenCode })
      }
    })
    .catch(error => console.error(error))
})

// export router
module.exports = router
