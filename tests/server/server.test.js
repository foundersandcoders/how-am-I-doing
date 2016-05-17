'use strict'

const test = require('tape')
const server = require('../../server/server.js')

test('server exists', (t) => {
  const actual = Object.keys(server).length > 0
  t.ok(actual, 'server exists')
  t.end()
})

test('server replies with status 200', (t) => {
  server.inject({method: 'GET', url:'/'}, (response) => {
    let actual =response.statusCode
    let expected = 200
    t.equal(actual, expected, 'server replies')
    t.end()
  })
}
)
