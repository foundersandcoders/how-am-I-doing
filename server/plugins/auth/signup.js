'use strict'

module.exports = () => {
  return {
    method: 'GET',
    path: '/signup',
    handler: (request, reply) => {
      reply.view('signup')
    },
    config: { auth: false }
  }
}
