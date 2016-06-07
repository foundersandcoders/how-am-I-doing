'use strict'

const Boom = require('boom')
const util = require('../db/util.js')

module.exports = (Schema) => {
  return {
    method: 'GET',
    path: '/api/questionnaires/scores',
    handler: (request, reply) => {
      Schema.models.Questionnaire.find({
        where: { user_id: request.auth.credentials.id }
      }, (err, questionnaires) => {
        if (err || !questionnaires)
          return reply(Boom.badRequest('Could not get questionnaires', err))

        Promise.all(questionnaires.map((questionnaire) => {
          return util.getAnswersByQuestionnaire(Schema, questionnaire.id)
        }))
          .then((questionnaireAnswers) => {
            const qs = questionnaireAnswers.map((answers, i) => {
              return {
                id: questionnaires[i].id,
                date: questionnaires[i].questionnaire_date.valueOf(),
                answers: answers,
                score: answers.reduce((a, b) => a + b.answer, 0)
              }
            })

            reply(qs)
          })
      })
    }
  }
}
