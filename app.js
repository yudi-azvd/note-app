const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const logger = require('./utils/logger')

const app = express()

logger.info('> connecting to', config.MONGODB_URI)
mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('> connected to MongoDB')
  })
  .catch((error) => {
    logger.info('> error in connectingo to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(middleware.requestLogger)


/*
OR ... use morgan
try to move this part to /utils/middleware

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan((tokens, req, res) => {
  return [
    '\n>>',
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res), '-',
    tokens['response-time'](req, res), 'ms', '-',
    tokens.body(req, res)
  ].join(' ')
}))
*/


app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
