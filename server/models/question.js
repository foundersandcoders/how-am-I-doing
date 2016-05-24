'use strict'

module.exports = (schema) => {
  return schema.define('question', {
    question_id: { type: schema.Number, unique: true },
    question_text: { type: schema.String }
  },
  { primaryKeys: ['question_id'] })
}
