'use strict'

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/dashboard',
    handler: (request, reply) => {
      reply.view('dashboard')
    }
  })
  next()
}

exports.register.attributes = {
  name: 'dashboard'
}
