const notesRouter = require('express').Router()
const Note = require('../models/note')


notesRouter.get('/', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes.map(note => note.toJSON()))
  })
})

notesRouter.get('/:id', (req, res, next) => {
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


notesRouter.post('/', (req, res, next) => {
  // without bodyParser, req.body woud be undefined
  const body = req.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date : new Date()
  })

  note // _then_ method of promise also returns a promise
    .save()
    .then(savedNote => savedNote.toJSON())
    .then(savedAndReturnedNote => res.json(savedAndReturnedNote))
    .catch(error => next(error))
})


notesRouter.delete('/:id', (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})


notesRouter.put('/:id', (req, res, next) => {
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

notesRouter.get('/api/', (req, res) => {
  res.send('<h1>HI!? from the APIssas</h1>')
})


module.exports = notesRouter
