const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const cors = require('cors')
require('./middlewares/passport')
const app = express()

// init middelware
app.use(cors())
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)

// database
require('./databases/init.postgresql')

// router
app.use('/', require('./routes/index.router'))

/* handle error */
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: error.stack,
    message: error.message
  })
})

module.exports = app
