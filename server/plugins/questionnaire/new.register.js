'use strict'

const Boom = require('boom')
const util = require('../db/util.js')

/*

POST /questionnaires/new/register
  1 Create new uncompleted questionnaire for logged in user
  2 Fill in categories for newly created questionnaire
  3 GET /questionnaires/{QUID}/questions

*/

module.exports = (Schema) => {
  return {
    method: 'POST',
    path: '/questionnaires/new/register',
    handler: (request, reply) => {
      Schema.models.User.findOne({
        where: { id: request.auth.credentials.id }
      }, (errUser, user) => {
        if (errUser || !user)
          return reply(Boom.unauthorized).unstate('token')

        user.questionnaire.create({}, (errQues, questionnaire) => {
          if (errQues || !questionnaire)
            return reply(Boom.badImplementation('DB error'))

          // Cast to numbers
          const catIDs = JSON.parse(request.payload.categories).map((id) => +id)

          if (! validateCategoryIDs(catIDs))
            return reply(Boom.badRequest('Invalid categories'))

          insertQuestionnaireCategories(Schema, questionnaire.id, catIDs)
            .then(() => reply.redirect('/questionnaires/' + questionnaire.id + '/questions'))
            .catch(() => reply(Boom.badImplementation('Unknown error')))
        })
      })
    }
  }
}


const validateCategoryIDs = (ids) => ids.reduce((acc, id) => acc && (id >= 0 && id <= 6), true)

function insertQuestionnaireCategories (Schema, quID, catIDs) {
  const data = catIDs.map((catID) => {
    return {
      cat_id: catID,
      questionnaire_id: quID
    }
  })

  return util.promisifyAllQueries(
    Schema,
    'QuestionnaireCategories',
    'create',
    data
  )
}
