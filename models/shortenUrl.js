// require mongoose
const mongoose = require('mongoose')

// set Schema
const Schema = mongoose.Schema
const ShortenUrlSchema = new Schema({
  originalUrl: {
    type: String,
    required: true
  },
  shortenedUrl: {
    type: String,
    required: true
  }
})

// export Schema
module.exports = mongoose.model('ShortenUrl', ShortenUrlSchema)