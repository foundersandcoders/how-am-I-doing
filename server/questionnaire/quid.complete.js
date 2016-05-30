'use strict'

const Boom = require('boom')

/*

POST /questionnaires/{QUID}/complete
  0 Preliminary checks
    0.1 Check if QUID is marked as completed
    0.2 Check if user owns QUID
    0.3 If either check fails, GET /questionnaires/new
  1 Mark questionnaire as completed
  2 Redirect to /dashboard

*/

module.exports = (Schema) => {
  return {
    method: 'POST',
    path: '/questionnaires/{QUID}/complete',
    handler: (request, reply) => {
      Schema.models.Questionnaire.update({
        where: { id: request.params.QUID }
      }, { completed: true }, (err, questionnaire) => {
        if (err || !questionnaire)
          return reply(Boom.badRequest('Cannot update questionnaire', err))

        reply.redirect('/dashboard')
      })
    }
  }
}
