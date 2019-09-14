require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const Note = require('./models/note')


/**
 * Os middlewares são chamados na ordem em que são usados
 */
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(errorHandler)
app.use(cors())

morgan.token('body', (req, res) => {
  // console.log('HERE', JSON.stringify(req.body));
  return JSON.stringify(req.body)
})


app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res), '-',
    tokens['response-time'](req, res), 'ms', '-',
    tokens.body(req, res)
  ].join(' ')
}))

app.post('/api/notes', (req, res) => {
  // without bodyParser, req.body woud be undefined
  const body = req.body

  if(!body.content)
    return res.status(404).json({
      error: 'content missing'
    })
  
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date : new Date(),
  }) 

  note.save().then(savedNote => res.json(savedNote.toJSON()))
})



app.get('/api/notes/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then(note => {
      if(note) {
        res.json(note.toJSON())
      }
      else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (req, res) => {
  Note.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes.map(note=> note.toJSON()))
  })
})


app.put('/api/notes/:id', (req, res, next) => {
  const body = req.body
  const note = {
    content:body.content,
    important: body.important,
  }  

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then(updatedNote => {
      res.json(updatedNote.toJSON())
    })
    .catch(error => next(error))
})

app.get('/api/', (req, res) => {
  res.send('<h1>HI!? from the APIssas</h1>')
})


const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if(error.name === 'CastError' && error.kind === 'ObjectId')
  return res.status(400).send({error: 'malformatted id'})
  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`> Server runnning on port ${PORT}`);
})


/**
 * - testar também diretamente pelo backend (VScode REST, Postman, Insomnia...)
 * - Integrar backend com frontend _uma_ funcionalidade por vez
 */