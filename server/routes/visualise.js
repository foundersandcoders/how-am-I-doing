'use strict'

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/visualise',
    handler: (request, reply) => {
      reply.view('visualise')
    }
  })
  next()
}

exports.register.attributes = {
  name: 'visualise'
}
