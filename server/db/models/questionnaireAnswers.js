'use strict'

module.exports = (Schema) => {
  return Schema.define('QuestionnaireAnswers', {
    answer: { type: Schema.Number },
    question_id: { type: Schema.Number }
  })
}
