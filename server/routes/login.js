'use strict'

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/login',
    handler: (request, reply) => {
      reply.view('login')
    },
    config: { auth: false }
  })
  next()
}

exports.register.attributes = {
  pkg: {
    name: 'login'
  }
}
