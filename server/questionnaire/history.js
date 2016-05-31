'use strict'

const Boom = require('boom')
const util = require('../db/util.js')

module.exports = (Schema) => {
  return {
    method: 'GET',
    path: '/questionnaires/history',
    handler: (request, reply) => {
      Schema.models.Questionnaire.find({
        where: { user_id: request.auth.credentials.id }
      }, (err, questionnaires) => {
        if (err || !questionnaires)
          return reply(Boom.badImplementation('DB Error', err))

        Promise.all(questionnaires.map((questionnaire) => {
          return util.getScoreByQuestionnaire(Schema, questionnaire.id)
        }))
          .then((scores) => {
            const qs = questionnaires.map((questionnaire, i) => {
              questionnaire.score = scores[i]
              questionnaire.questionnaire_date = questionnaire.questionnaire_date.toDateString()
              return questionnaire
            })

            reply.view('questionnaire-history', {
              questionnaires: qs,
              heading: 'History',
              scripts: ['/js/questionnaires.history.js']
            })
          })
          .catch((error) => {
            reply(Boom.badImplementation('Unknown error', error))
          })
      })
    }
  }
}
