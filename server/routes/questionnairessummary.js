'use strict'

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/questionnaires/new/summary',
    handler: (request, reply) => {
      reply.view('qsummary')
    }
  })
  next()
}

exports.register.attributes = {
  pkg: {
    name: 'questionnairessummary'
  }
}
