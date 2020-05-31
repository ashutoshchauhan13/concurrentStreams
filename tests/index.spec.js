jest.mock('../controllers/stream');
const app = require('../server')
const supertest = require('supertest')
const request = supertest(app)
const stream  = require('../controllers/stream');

it('get of user/stream returns 200 Ok', async done => {
  const response = await request.get('/user/stream')
  expect(response.status).toBe(200)
  expect(response.body.message).toBe('You have 0 active streams available')
  done()
})

it('post of user/stream returns 200 Ok', async done => {
  const response = await request.post('/user/stream')
  expect(response.status).toBe(200)
  expect(response.body.message).toBe('Stream added successfull')
  done()
})

it('delete of user/stream returns 200 Ok', async done => {
  const response = await request.delete('/user/stream')
  expect(response.status).toBe(200)
  expect(response.body.message).toBe('Stream removed successfully')
  done()
})
