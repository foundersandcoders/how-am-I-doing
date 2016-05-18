'use strict'

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/reset',
    handler: (request, reply) => {
      reply.view('reset')
    }
  })

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'reset'
  }
}
