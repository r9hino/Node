require('dotenv').config()

const {Pool} = require('pg')
const isProduction = process.env.NODE_ENV === 'production'
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction,
})


const getBooks = (request, response) => {
  pool.query('SELECT * FROM temp.books', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getBookById = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM temp.books WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const addBook = (request, response) => {
  const { author, title } = request.body

  pool.query('INSERT INTO temp.books (author, title) VALUES ($1, $2)', [author, title], error => {
    if (error) {
      throw error
    }
    response.status(201).json({ status: 'success', message: 'Book added.' })
  })
}


const updateBook = (request, response) => {
  const id = parseInt(request.params.id)
  const {author, title} = request.body

  pool.query(
    'UPDATE temp.books SET author = $1, title = $2 WHERE id = $3',
    [author, title, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Book modified with ID: ${id}`)
    }
  )
}


const deleteBook = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM temp.books WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Book deleted with ID: ${id}`)
  })
}

module.exports = {getBooks, getBookById, addBook, updateBook, deleteBook}