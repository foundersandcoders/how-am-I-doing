'use strict'

module.exports = {
  method: 'GET',
  path: '/dashboard',
  handler: (request, reply) => {
    reply.view('dashboard')
  }
}
