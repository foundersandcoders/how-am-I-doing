'use strict'

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/questionnaires/history',
    handler: (request, reply) => {
      reply.view('qhistory')
    }
  })
  next()
}

exports.register.attributes = {
  pkg: {
    name: 'questionnaireshistory'
  }
}
