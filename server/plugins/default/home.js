'use strict'

module.exports = {
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    reply.view('index')
  },
  config: { auth: false }
}
