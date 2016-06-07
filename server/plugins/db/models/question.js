'use strict'

module.exports = (schema) => {
  return schema.define('Question', {
    question_id: { type: schema.Number, unique: true },
    question_text: { type: schema.String }
  })
}
