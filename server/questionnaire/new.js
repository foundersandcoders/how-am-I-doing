'use strict'

const Boom = require('boom')

/*

GET /questionnaires/new
  1 Get list of categories
  2 Render view
  3 User selects categories then POST /questionnaires/new/register

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
          heading: 'Questionnaire',
          scripts: ['/js/questionnaires.new.js']
        })
      })
    }
  }
}
