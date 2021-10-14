// require express Router
const express = require('express')
const router = express.Router()

// require modules
const home = require('./modules/home')
const shorten = require('./modules/shorten')

// redirect request
router.use('/', home)
router.use('/shorten', shorten)

// export router
module.exports = router