'use strict'

const Boom = require('boom')
const util = require('../db/util.js')

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
          console.log(err)
          reply(Boom.badImplementation('Oops', err))
        })
    }
  }
}
