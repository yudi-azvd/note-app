const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())
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


app.use(express.static('build'))

let notes = [
  {
    id: 1, 
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: false
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
]


app.get('/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(note => note.id === id)
  if (note) 
    res.json(note)
  else 
    res.status(404).end()
})

app.delete('/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = filter(note => note !== id)
  res.status(204).end()
})

app.get('/notes', (req, res) => {
  console.log('getting all notes');
  res.json(notes)
})

const generateId = () => {
  const maxId = notes.length > 0 ?
  Math.max(...notes.map(n =>n.id)) : 0
  return maxId + 1
}

app.post('/notes', (req, res) => {

  // without bodyParser, req.body woud be undefined
  const body = req.body

  if(!body.content)
    return res.status(404).json({
      error: 'content missing'
    })
  
  const note = {
    content: body.content,
    important: body.important || false,
    date : new Date(),
    id: generateId()
  }

  notes = notes.concat(note)
  res.json(note)
})

app.put('/notes/:id', (req, res) => {
  const noteToUpdate = req.body
  // const id = Number(req.params.id)
  const existingNote = notes.find(note => note.id === noteToUpdate.id)
  if(existingNote) {
    notes = notes.map(note => note.id === existingNote.id ?
      existingNote : note
    )
    res.json(noteToUpdate)
  }
  else 
    res.status(404).end()
})

app.get('/', (req, res) => {
  res.send('<h1>HI!?</h1>')
})

// a ordem importa
const PORT =  process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server runnning on port ${PORT}`);
  console.log('só pra mudar');
})