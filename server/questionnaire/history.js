'use strict'

module.exports = () => {
  return {
    method: 'GET',
    path: '/questionnaires/history',
    handler: (request, reply) => {
      reply.view('questionnaire-history')
    }
  }
}
