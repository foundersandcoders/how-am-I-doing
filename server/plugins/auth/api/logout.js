'use strict'

module.exports = () => {
  return {
    method: 'GET',
    path: '/api/logout',
    handler: (request, reply) => {
      return reply.redirect('/').unstate('token')
    }
  }
}
