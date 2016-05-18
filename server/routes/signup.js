'use strict'

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/signup',
    handler: (request, reply) => {
      reply.view('signup')
    }
  })
  next()
}

exports.register.attributes = {
  name: 'signup'
}
