'use strict'

exports.register = function (server, options, next) {

  server.route({
    method: 'POST',
    path: '/questionnaires/{quid}',
    handler: (request, reply) => {
      reply.view('questionnairesid')
    }
  })
  next()
}

exports.register.attributes = {
  pkg: {
    name: 'questionnaires'
  }
}
