'use strict'

require('chai').should()
const Bcrypt = require('bcrypt')

describe('Simple server tests', () => {
  let server

  beforeEach((done) => {
    server = require('../../server/server.js')
    done()
  })

  afterEach((done) => {
    done()
  })

  it('Server actually exists', (done) => {
    Object.keys(server).length.should.be.at.least(1)
    done()
  })

  it('Server replies with 200 statusCode and HTML', (done) => {
    server.inject({ method: 'GET', url: '/' }, (response) => {
      response.statusCode.should.equal(200)
      response.payload.indexOf('<html>').should.be.at.least(0)
      done()
    })
  })
})

describe('E2E Auth Tests', () => {
  let server

  beforeEach((done) => {
    server = require('../../server/server.js')
    server.app.Schema.adapter.automigrate(done)
  })

  afterEach((done) => {
    server.app.Schema.adapter.flushAll(() => {
      done()
    })
  })

  it('Should be able to create user by posting to signup endpoint', (done) => {
    server.inject({
      method: 'POST',
      url: '/api/signup',
      payload: {
        username: 'tom',
        password: 'apples',
        confirm_password: 'apples',
        user_email: 'tomupton@gmail.com',
        clinic_email: 'roger@gmail.com',
        clinic_number: '07986534562'
      }
    }, (response) => {
      response.statusCode.should.equal(302)

      server.app.User.findById(1, (err, user) => {
        if (err)
          throw err

        user.user_name.should.equal('tom')
        done()
      })
    })
  })

  it('Should be able to login', (done) => {
    function encrypt (pw) {
      return Bcrypt.hashSync(pw, 10)
    }

    const user = {
      user_name: 'tu6619',
      user_email: 'user.test@test.com',
      user_secret: encrypt('password'),
      clinic_email: 'clinic.test@test.com',
      clinic_number: '07654321456'
    }

    server.app.User.create(user, (err) => {
      if (err)
        throw err

      server.inject({
        method: 'POST',
        url: '/api/login',
        payload: {
          username: 'tu6619',
          password: 'password'
        }
      }, (response) => {
        response.statusCode.should.equal(302)
        response.headers.location.should.equal('/dashboard')
        done()
      })
    })
  })

  it('Should not be able to login with wrong password', (done) => {
    function encrypt (pw) {
      return Bcrypt.hashSync(pw, 10)
    }

    const user = {
      user_name: 'tu6619',
      user_email: 'user.test@test.com',
      user_secret: encrypt('password'),
      clinic_email: 'clinic.test@test.com',
      clinic_number: '07654321456'
    }

    server.app.User.create(user, (err) => {
      if (err) throw err
      server.inject({
        method: 'POST',
        url: '/api/login',
        payload: {
          username: 'tu6619',
          password: 'passwort'
        }
      }, (response) => {
        response.statusCode.should.equal(302)
        response.headers.location.should.equal('/login')
        done()
      })
    })
  })

  it('Should not be able to login with wrong username', (done) => {
    function encrypt (pw) {
      return Bcrypt.hashSync(pw, 10)
    }

    const user = {
      user_name: 'tu6619',
      user_email: 'user.test@test.com',
      user_secret: encrypt('password'),
      clinic_email: 'clinic.test@test.com',
      clinic_number: '07654321456'
    }

    server.app.User.create(user, (err) => {
      if (err) throw err
      server.inject({
        method: 'POST',
        url: '/api/login',
        payload: {
          username: 'tu6618',
          password: 'password'
        }
      }, (response) => {
        response.statusCode.should.equal(302)
        response.headers.location.should.equal('/login')
        done()
      })
    })
  })
})
