// require express
const express = require('express')
const app = express()

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