'use strict'

const util = require('../db/util.js')
const Boom = require('boom')

exports.register = function (server, options, next) {

  const routes = [
    'api',
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

  server.ext('onPreHandler', (request, reply) => {
    if (! /\/questionnaires\/\d+\/\w+/.test(request.path))
      return reply.continue()

    const isCompleted = util.isQuestionnaireCompleted(
        server.app.Schema, request.params.QUID
      )

    const isAuthorised = util.isQuestionnaireCreatedByUser(
        server.app.Schema, request.params.QUID, request.auth.credentials.id
      )

    Promise.all([isCompleted, isAuthorised]).then((results) => {
      if (results[0] && results[1] && /\/questionnaires\/\d+\/summary/.test(request.path))
        return reply.continue()

      if (results[0] || !results[1])
        return reply.redirect('/questionnaires/new')

      return reply.continue()
    })
    .catch((err) => reply(Boom.badImplementation('DB error', err)))
  })

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'questionnaires'
  }
}
