'use strict'

const wtape = require('wrapping-tape')
const server = require('../../server/server.js')

const tape = wtape({})

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
