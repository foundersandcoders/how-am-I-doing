'use strict'

const Boom = require('boom')
const util = require('../db/util.js')

module.exports = (Schema) => {
  return {
    method: 'GET',
    path: '/api/questionnaires',
    handler: (request, reply) => {
      if (request.query.cat_id) {
        let dbQuestionnaires

        util.promisifyQuery(Schema, 'QuestionnaireCategories', 'find', {
          where: { cat_id: +request.query.cat_id }
        })
        .then((qCats) => {
          const QUIDs = qCats.map((c) => c.questionnaire_id)
          return util.promisifyQuery(Schema, 'Questionnaire', 'find', {
            where: { user_id: request.auth.credentials.id, id: { in: QUIDs }, completed: true }
          })
        })
        .then((questionnaires) => {
          dbQuestionnaires = questionnaires
          return Promise.all(questionnaires.map((questionnaire) => {
            return util.getAnswersByQuestionnaire(Schema, questionnaire.id)
          }))
        })
        .then((qAnswers) => {
          const qs = qAnswers.map((answers, i) => {
            return {
              id: dbQuestionnaires[i].id,
              date: dbQuestionnaires[i].questionnaire_date.valueOf(),
              answers: answers,
              score: answers.reduce((a, b) => a + b.answer, 0)
            }
          })

          reply(qs)
        })
        .catch((err) => Boom.badImplementation('Oops', err))
      } else {
        reply({})
      }
    }
  }
}
