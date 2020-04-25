//https://www.taniarascia.com/node-express-postgresql-heroku/
//https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const q = require('./queries')

const app = express()
const port = 3002

app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

/*app
  .route('/books')
  // GET endpoint
  .get(q.getBooks)
  // POST endpoint
  .post(q.addBook);
*/

app.route('/books').get(q.getBooks)
app.route('/books/:id').get(q.getBookById)
app.route('/books').post(q.addBook)
app.route('/books/:id').put(q.updateBook)
app.route('/books/:id').delete(q.deleteBook)

// Start server
app.listen(port, () => {
  console.log(`Server listening ${port}.`)
})