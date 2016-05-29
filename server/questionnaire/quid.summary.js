'use strict'

const Boom = require('boom')
const util = require('../db/util.js')

/*

GET /questionnaires/{QUID}/summary
  0 Preliminary checks
    0.1 Check if QUID is marked as completed
    0.2 Check if user owns QUID
    0.3 If either check fails, GET /questionnaires/new
  1 Get answers for QUID from DB
  2 Get question texts for all relevant questions from DB
  3 Parse answers into array of objects with qid, answer fields
  4 Form templating object w/ question text and answer boolean flags
  5 Render view
  6 User confirms answers
    6.1 POST /questionnaires/{QUID}/complete
    or
  7 User clicks back to make changes
    7.1 GET /questionnaires/{QUID}/questions

*/
module.exports = (Schema) => {
  return {
    method: 'GET',
    path: '/questionnaires/{QUID}/summary',
    handler: (request, reply) => {
      let answers

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

          return util.getAnswersByQuestionnaire(Schema, request.params.QUID)
        })
        .then((results) => {
          answers = results
          const qIDs = answers.map((answer) => answer.question_id)
          return util.getQuestionsById(Schema, qIDs)
        })
        .then((questions) => {
          const fullAnswers = answers.map((answer) => {
            const q = questions.filter((question) => question.id === answer.question_id)
            return {
              question_text: q[0].question_text,
              never: answer.answer === 0,
              sometimes: answer.answer === 1,
              often: answer.answer === 2,
              always: answer.answer === 3
            }
          })

          reply.view('questionnaire-summary', { answers: fullAnswers, QUID: request.params.QUID })
        })
        .catch((err) => {
          reply(Boom.badImplementation('Oops', err))
        })
    }
  }
}
