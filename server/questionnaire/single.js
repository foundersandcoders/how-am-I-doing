'use strict'

module.exports = () => {
  return {
    method: 'GET',
    path: '/questionnaires/{questionnaire_id}',
    handler: (request, reply) => {
      reply.view('questionnaire-single')
    }
  }
}
