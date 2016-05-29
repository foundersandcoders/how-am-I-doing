'use strict'

const Boom = require('boom')
const util = require('../db/util.js')

module.exports = (Schema) => {
  return {
    method: 'GET',
    path: '/questionnaires/{QUID}/questions',
    handler: (request, reply) => {
      util.isQuestionnaireCompleted(Schema, request.params.QUID)
        .then((isCompleted) => {
          if (isCompleted)
            return reply.redirect('/questionnaires/new')

          return util.isQuestionnaireCreatedByUser(
            Schema, request.params.QUID, request.auth.credentials.id
          )
        })
        .then((isAuthorised) => {
          if (!isAuthorised)
            return reply.redirect('/questionnaires/new')

          return util.getQuestionsByQuestionnaire(Schema, request.params.QUID)
        })
        .then((questions) => {
          reply.view('questionnaire-question', { questions, QUID: request.params.QUID })
        })
        .catch((err) => {
          reply(Boom.notFound('Oops', err))
        })
    }
  }
}
