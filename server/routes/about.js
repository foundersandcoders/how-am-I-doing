'use strict'

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/about',
    handler: (request, reply) => {
      reply.view('about', { heading: 'About' })
    },
    config: { auth: false }
  })
  next()
}

exports.register.attributes = {
  pkg: {
    name: 'about'
  }
}
