const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

console.log(`> connecting to ${url}\n`)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('> connected to MongoDB\n')
  })
  .catch(error => {
    console.log('> Error in connectingo MongoDB:',  error.message)
  })


// MongoDB é sem esquema
// o esquema é a nível de APLICAÇÃO
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: 5,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  important: Boolean
})

// daria problemas nos testes se essa alteração não fosse feita
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Note', noteSchema)

