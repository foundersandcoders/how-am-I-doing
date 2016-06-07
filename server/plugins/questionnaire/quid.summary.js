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
      const isCompleted = util.isQuestionnaireCompleted(Schema, request.params.QUID)
      const questions = util.getQuestionsByQuestionnaire(Schema, request.params.QUID)
      const answers = util.getAnswersByQuestionnaire(Schema, request.params.QUID)

      Promise.all([isCompleted, questions, answers])
          .then((results) => {
            const completed = results[0]
            const ques = results[1]
            const answ = results[2]

            const fullAnswers = ques.map((question) => {
              const answer = answ.filter((a) => question.id === a.question_id)
              const o = { question_text: question.question_text }
              if (answer.length) {
                o.never = answer[0].answer === 0
                o.sometimes = answer[0].answer === 1
                o.often = answer[0].answer === 2
                o.always = answer[0].answer === 3
              }
              return o
            })
            reply.view('questionnaire-summary', {
              answers: fullAnswers,
              QUID: request.params.QUID,
              heading: 'Summary',
              completed
            })
          })
          .catch((err) => {
            console.log(err.stack)
            reply(Boom.badImplementation('Oops', err))
          })
    }
  }
}
