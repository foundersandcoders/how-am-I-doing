'use strict'

const Boom = require('boom')
const util = require('../db/util.js')

/*

GET /questionnaires/{QUID}/questions
  0 Preliminary checks
    0.1 Check if QUID is marked as completed
    0.2 Check if user owns QUID
    0.3 If either check fails, GET /questionnaires/new
  1 Get questions for questionnaire QUID
    1.1 Get categories for QUID
    1.2 Get questions for categories
    1.3 Get answers for QUID (if exist)
  2 Create templating data object w/ questions and answers
  3 Render view
  4 User submits completed questionnaire POST /questionnaires/{QUID}/answers

*/

module.exports = (Schema) => {
  return {
    method: 'GET',
    path: '/questionnaires/{QUID}/questions',
    handler: (request, reply) => {
      util.getQuestionsByQuestionnaire(Schema, request.params.QUID)
        .then((questions) => {
          reply.view('questionnaire-question', {
            questions,
            QUID: request.params.QUID,
            heading: 'Questionnaire ' + request.params.QUID
          })
        })
        .catch((err) => {
          reply(Boom.notFound('Oops', err))
        })
    }
  }
}
