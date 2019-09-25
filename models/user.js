const mongoose = require('mongoose')
const uniqueValidor = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
})

// não entendi ainda o que esse plugin faz
/**
 * This makes error handling much easier, since 
 * you will get a Mongoose validation error when 
 * you attempt to violate a unique constraint, rather
 * than an E11000 error from MongoDB.
 */
userSchema.plugin(uniqueValidor)

userSchema.set('toJSON', {
  transform: (document, returnedUser) => {
    returnedUser.id = returnedUser._id
    delete returnedUser._id
    delete returnedUser.__v
    // the password should not be revealed
    delete returnedUser.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)