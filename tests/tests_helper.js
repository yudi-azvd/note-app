const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
  {
    content: 'HTML is easy',
    // tem eu fazer Date não requerido
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    important: true,
  },
]


const nonExistingId = async () => {
  const note = new Note({content: 'willremovesoom'})

  await note.save()
  await note.remove()

  return note._id.toString()
}


const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}


module.exports = {
  initialNotes, 
  nonExistingId, 
  notesInDb,
  usersInDb
}
