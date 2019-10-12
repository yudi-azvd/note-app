const jwt = require('jsonwebtoken')
const notesRouter = require('express').Router()

const Note = require('../models/note')
const User = require('../models/user')


notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(notes.map(note => note.toJSON()))
})


notesRouter.get('/:id', async (request, response, next) => {
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
    const note = await Note.findById(request.params.id)

    if (note)
      response.json(note.toJSON())
    else 
      response.status(404).end()
  }
  catch (exception) {
    next(exception)
  }
})


const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer '))
    return authorization.substring(7)
  return null
}

notesRouter.post('/', async (request, response, next) => {
  // without bodyParser, req.body woud be undefined
  const body = request.body
  const token = getTokenFrom(request)

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    console.log('> decodedToken', decodedToken)
    if(!token || !decodedToken.id)
      return response.status(401).json({ error: 'token mimssing or invalid' })

    const user = await User.findById(decodedToken.id)

    const note = new Note({
      content: body.content,
      important: body.important || false,
      date : new Date(),
      user: user._id
    })
    
    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    response.status(201).json(savedNote.toJSON())
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


notesRouter.put('/:id', (request, response, next) => {
  const body = request.body
  const note = {
    content:body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote.toJSON())
    })
    .catch(error => next(error))
})

notesRouter.get('/api/', (req, res) => {
  res.send('<h1>HI!? from the APIssas</h1>')
})


module.exports = notesRouter
