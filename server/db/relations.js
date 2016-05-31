'use strict'

module.exports = (Schema) => {
  Schema.models.User.hasMany(Schema.models.Questionnaire, {
    as: 'questionnaire',
    foreignKey: 'user_id'
  })

  Schema.models.Category.hasMany(Schema.models.Question, {
    as: 'question',
    foreignKey: 'cat_id'
  })

  Schema.models.Question.belongsTo(Schema.models.Category, {
    as: 'category',
    foreignKey: 'question_id'
  })

  Schema.models.Questionnaire.hasMany(Schema.models.QuestionnaireAnswers, {
    as: 'answer',
    foreignKey: 'questionnaire_id'
  })

  Schema.models.Questionnaire.hasMany(Schema.models.QuestionnaireCategories, {
    as: 'category',
    foreignKey: 'questionnaire_id'
  })
}
