'use strict'

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply.view('index', { toIndex: true })
    },
    config: { auth: false }
  })

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'home'
  }
}
