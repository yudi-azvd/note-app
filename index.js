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
app.use(cors())

morgan.token('body', (req, res) => {
  // console.log('HERE', JSON.stringify(req.body));
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



app.post('/api/notes', (req, res, next) => {
  // without bodyParser, req.body woud be undefined
  const body = req.body
  console.log(body);

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date : new Date(),
  }) 

  note // _then_ method of promise also returns a promise
    .save()
    .then(savedNote => savedNote.toJSON())
    .then(savedAndReturnedNote => res.json(savedAndReturnedNote))
    .catch(error => next(error))
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
  console.error('error.message from ERROR_HANLDER')
  if(error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({error: 'malformatted id'})
  }
  else if (error.name === 'ValidationError') {
    console.log({error: error.message})
    return res.status(400).send({error: error.message})
  }

  console.log('NOT BEING HANDLED')
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