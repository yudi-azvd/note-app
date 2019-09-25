const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const { body } = request
    const saltRounds = 10
    console.log('>>', body)
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    
    const newUser = new User({
      ...body,
      passwordHash: passwordHash
    })

    const savedUser = await newUser.save()
    response.json(savedUser.toJSON())

  } catch (exception) {
    // console.log('ESCEPTIOOOOOOOOOONNN')
    next(exception)
  }
})

module.exports = usersRouter