'use strict'

module.exports = (Schema) => {
  return Schema.define('QuestionnaireCategories', {
    cat_id: { type: Schema.Number }
  })
}
