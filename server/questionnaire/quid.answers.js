'use strict'

const Boom = require('boom')
const util = require('../db/util.js')

module.exports = (Schema) => {
  return {
    method: 'POST',
    path: '/questionnaires/{QUID}/answers',
    handler: (request, reply) => {
      util.isQuestionnaireCompleted(Schema, request.params.QUID)
        .then((isCompleted) => {
          if (isCompleted)
            return reply.redirect('questionnaires/new')

          const data = request.payload

          const answers = Object.keys(data)
            .filter((key) => /^answer\-\d+$/.test(key))
            .map((key) => {
              return {
                question_id: +key.slice(7),
                answer: +data[key]
              }
            })

          return util.upsertAnswersByQuestionnaire(Schema, request.params.QUID, answers)
        })
        .then(() => {
          reply.redirect('/questionnaires/' + request.params.QUID + '/summary')
        })
        .catch((err) => {
          reply(Boom.notFound('Oops', err))
        })
    }
  }
}
