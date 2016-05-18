'use strict'

exports.register = (server, options, next) => {
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply.view('index')
    }
  })
  next()
}

exports.register.attributes = {
  name: 'home'
}
