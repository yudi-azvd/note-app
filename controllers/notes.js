const notesRouter = require('express').Router()

const Note = require('../models/note')
const User = require('../models/user')

notesRouter.get('/', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes.map(note => note.toJSON()))
  })
})


notesRouter.get('/:id', async (req, res, next) => {
  // Note.findById(req.params.id)
  //   .then(note => {
  //     if(note) {
  //       res.json(note.toJSON())
  //     }
  //     else {
  //       res.status(404).end()
  //     }
  //   })
  //   .catch(error => next(error))
  try {
    const note = await Note.findById(req.params.id)

    if (note)
      res.json(note.toJSON())
    else 
      res.status(404).end()
  }
  catch (exception) {
    next(exception)
  }

})


notesRouter.post('/', async (req, res, next) => {
  // without bodyParser, req.body woud be undefined
  const body = req.body
  const user = await User.findById(body.userId)

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date : new Date(),
    user: user._id
  })

  // note // _then_ method of promise also returns a promise
  //   .save()
  //   .then(savedNote => savedNote.toJSON())
  //   .then(savedAndReturnedNote => res.json(savedAndReturnedNote))
  //   .catch(error => next(error))

  try {
    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    res.status(201).json(savedNote.toJSON())
  }
  catch(exception) {
    next(exception)
  }
})


notesRouter.delete('/:id', async (req, res, next) => {
  try {
    await Note.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } 
  catch (exception) {
    next(exception)
  }
  // Note.findByIdAndRemove(req.params.id)
  //   .then(() => {
  //     res.status(204).end()
  //   })
  //   .catch(error => next(error))
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
