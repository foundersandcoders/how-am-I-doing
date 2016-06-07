'use strict'

module.exports = (schema) => {
  return schema.define('Questionnaire', {
    questionnaire_date: { type: schema.Date, default: Date.now },
    completed: { type: schema.Boolean, default: false }
  })
}
