'use strict'

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/questionnaires/new/question/{qid}',
    handler: (request, reply) => {
      reply.view('questionnairesnewquestion')
    }
  })
  next()
}

exports.register.attributes = {
  pkg: {
    name: 'questionnairesnewquestions'
  }
}
