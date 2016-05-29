'use strict'

const util = require('../db/util.js')

exports.register = function (server, options, next) {

  const routes = [
    'history',
    'new',
    'new.register',
    'quid.answers',
    'quid.complete',
    'quid.questions',
    'quid.summary',
    'single',
  ].map((el) => require('./' + el + '.js')(server.app.Schema))

  server.route(routes)

  server.ext('onRequest', (request, reply) => {
    if (/\/questionnaires\/\d+\/\w+/.test(request.path)) {
      util.isQuestionnaireCompleted(server.app.Schema, request.params.QUID)
        .then((isCompleted) => {
          if (isCompleted)
            return reply.redirect('/questionnaires/new')

          return util.isQuestionnaireCreatedByUser(
            server.app.Schema, request.params.QUID, request.auth.credentials.id
          )
        })
        .then((isAuthorised) => {
          if (!isAuthorised)
            return reply.redirect('/questionnaires/new')

          return reply.continue()
        })
    }

    reply.continue()
  })

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'questionnaires'
  }
}
