'use strict'

const Boom = require('boom')
const util = require('../db/util.js')

module.exports = (Schema) => {
  return {
    method: 'POST',
    path: '/questionnaires/{QUID}/complete',
    handler: (request, reply) => {
      util.isQuestionnaireCompleted(Schema, request.params.QUID)
        .then((isComplete) => {
          if (isComplete)
            return reply.redirect('/questionnaires/new')

          return util.isQuestionnaireCreatedByUser(
            Schema, request.params.QUID, request.auth.credentials.id
          )
        })
        .then((isAuthorised) => {
          if (!isAuthorised)
            return reply.redirect('/questionnaires/new')

          Schema.models.Questionnaire.update({
            where: { id: request.params.QUID }
          }, { completed: true }, (err, questionnaire) => {
            if (err || !questionnaire)
              return reply(Boom.badRequest('Cannot update questionnaire', err))

            reply.redirect('/dashboard')
          })
        })
    }
  }
}
