const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./tests_helper')

const app = require('../app')

/**
 * node enviroment variable for tests, production e developemnt
 * corss-env for multiple plataform
 * 
 * async/await
 * error handling with try/catch
 * 
 * Promimse.all
 * 
 * helper fo tests
 * 
 * refactor test by grouping similiar test cases 
 * in describe blocks
 */

/**
 * imports the express app which is wrapped by the 
 * supertest function, so called _superagent object_.
 */
const api = supertest(app)

const Note = require('../models/note')


beforeEach(async () => {
  await Note.deleteMany({})
  /**
   * Optimizing the beforeEach function
   * https://fullstackopen.com/en/part4/testing_the_backend
   */

  /**
   * The problem is that every iteration of the 
   * forEach loop generates its own asynchronous 
   * operation, and beforeEach won't wait for them 
   * to finish executing. In other words, the await 
   * commands defined inside of the forEach loop are
   * not in the beforeEach function, but in separate 
   * functions that beforeEach will not wait for.
   */
  // helper.initialNotes.forEach(async (note) => {
  //   let newNote = new Note(note)
  //   await newNote.save()
  //   console.log('saved')
  // })

  const newNotes = helper.initialNotes
    .map(note => new Note(note))
  const promisesArray = newNotes.map(note => note.save())
  await Promise.all(promisesArray) // resolves Promises in parallel 
})

describe('when there is initially some notes saved', () => {
  test('notes are returned as JSON', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('all the notes are returned', async () => {
    const response = await api.get('/api/notes')
    expect(response.body.length).toBe(helper.initialNotes.length)
  })
  
  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')
  
    const contents = response.body.map(r => r.content)
    expect(contents).toContain(
      'Browser can execute only Javascript'
    )
  })

  describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
      const notesAtStart = await helper.notesInDb()
  
      const noteToView = notesAtStart[0]
  
      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      expect(resultNote.body).toEqual(noteToView)
    })
  
    test('fails with statuscode 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()
  
      await api
        .get(`/api/notes/${validNonexistingId}`)
        .expect(404)
    })
  
    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'
  
      await api
        .get(`/api/notes/${invalidId}`)
        .expect(400)
    })
  })
  
  describe('addition of new note', () => {
    test('succeeds with valid data', async () => {
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
      }
  
      await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
  
      const notesAtEnd = await helper.notesInDb()
      expect(notesAtEnd.length).toBe(helper.initialNotes.length + 1)
  
      const contents = notesAtEnd.map(n => n.content)
      expect(contents).toContain(
        'async/await simplifies making async calls'
      )
    })
  
    test('fails with status code 400 if data invaild', async () => {
      const newNote = {
        important: true
      }
  
      await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)
  
      const notesAtEnd = await helper.notesInDb()
  
      expect(notesAtEnd.length).toBe(helper.initialNotes.length)
    })
  })
  
  describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]
  
      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)
  
      const notesAtEnd = await helper.notesInDb()
  
      expect(notesAtEnd.length).toBe(
        helper.initialNotes.length - 1
      )
  
      const contents = notesAtEnd.map(r => r.content)
  
      expect(contents).not.toContain(noteToDelete.content)
    })
  })
  
  
})


afterAll(() => {
  mongoose.connection.close()
})
