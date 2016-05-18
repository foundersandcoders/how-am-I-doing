'use strict'

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/login',
    handler: (request, reply) => {
      reply.view('login')
    }
  })
  next()
}

exports.register.attributes = {
  name: 'login'
}
