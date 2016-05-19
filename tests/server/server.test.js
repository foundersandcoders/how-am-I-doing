'use strict'

const wtape = require('wrapping-tape')
const server = require('../../server/server.js')

const tape = wtape({
  setup: (t) => {
    t.end()
  },
  teardown: (t) => {
    setTimeout(() => {
      if (server.app.Schema.client.connected)
        server.app.Schema.client.flushdb()
      t.end()
    }, 100)
  }
})

tape('server exists', (t) => {
  const actual = Object.keys(server).length > 0
  t.ok(actual, 'server exists')
  t.end()
})

tape('server replies with status 200', (t) => {
  server.inject({ method: 'GET', url: '/' }, (response) => {
    const actual = response.statusCode
    const expected = 200
    t.equal(actual, expected, 'server replies')
    t.end()
  })
})

tape('server serves up html', (t) => {
  server.inject({ method: 'GET', url: '/' }, (response) => {
    const actual = response.payload.indexOf('<html>') > -1
    t.ok(actual, 'html tag found')
    t.end()
  })
})

tape('payload from http request creates user as expected', (t) => {
  server.inject({ method: 'POST', url: '/api/signup', payload: {
    username: 'tom',
    password: 'apples',
    confirm_pasword: 'apples',
    user_email: 'tomupton@gmail.com',
    clinic_email: 'roger@gmail.com',
    clinic_number: '07986534562'
  }
    }, (response) => {
    let actual = response.statusCode
    let expected = 302
    t.equal(actual, expected, 'server redirects')

    server.app.User.findById(1, (err, users) => {
      if (err) throw err
      actual = users.user_name
      expected = 'tom'
      t.equal(actual, expected, 'number of users is correct')
      t.end()
    })
  })
})

tape('Final teardown', (t) => {
  server.app.Schema.client.flushdb()
  server.app.Schema.client.quit()
  t.end()
})
