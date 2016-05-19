'use strict'

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: ' /questionnaires/new',
    handler: (request, reply) => {
      reply.view('newq')
    }
  })
  next()
}

exports.register.attributes = {
  pkg: {
    name: 'newquestionnaires'
  }
}
