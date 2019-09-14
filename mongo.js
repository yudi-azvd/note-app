const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give passwrd as arg');
  process.exit(1)
}

const password = 'fullstack'

const url = 
`mongodb+srv://fullstack:${password}@notescluster-xhiug.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewParser: true })


// MongoDB é sem esquema
// o esquema é a nível de APLICAÇÃO
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
})

const Note = mongoose.model('Notes', noteSchema)


const note = new Note({
  content: 'HTML is easy',
  date : new Date(),
  important: true
})

// note.save().then(result => {
//   console.log('note saved:', result);
//   mongoose.connection.close()
// })

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})