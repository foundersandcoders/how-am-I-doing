'use strict'

const Boom = require('boom')

/*

1. GET /questionnaires/new
  1.1 User selects which categories for the questionnaire
  1.2 User submits the form

*/

module.exports = (Schema) => {
  return {
    method: 'GET',
    path: '/questionnaires/new',
    handler: (request, reply) => {
      Schema.models.Category.all((err, categories) => {
        if (err)
          return reply(Boom.badImplementation('DB Error'))

        if (! categories || categories.length < 1)
          return reply(Boom.badImplementation('No categories'))

        reply.view('questionnaire-new', {
          categories,
          heading: 'New Questionnaire',
          scripts: ['/js/questionnaires.new.js']
        })
      })
    }
  }
}
