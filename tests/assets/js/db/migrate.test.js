'use strict'

const wtape = require('wrapping-tape')
const migrate = () => require('../../../../assets/js/db/migrate.js')

const raw = {
  questions: require('../../../../data.questions.json'),
  categories: require('../../../../data.categories.json'),
}

const tape = wtape({
  setup: (t) => t.end(),
  teardown: (t) => t.end()
})

tape('Test can migrate categories', (t) => {
  migrate().then(() => {
    const Schema = require('../../../../server/db/schema.js')()

    Schema.models.Category.find({ order: 'cat_id' }, (err, categories) => {
      t.ok(!err, 'No error')
      t.equal(categories.length, 6, 'There are 6 categories')

      categories.forEach((category) => {
        const actual = category
        const expected = raw.categories[category.cat_id]
        t.equal(actual.cat_id, expected.cat_id, 'ID match: ' + actual.cat_id)
        t.equal(actual.cat_name, expected.cat_name, 'Names match: ' + actual.cat_name)
      })

      Schema.client.flushdb(() => {
        Schema.client.quit()
        t.end()
      })
    })
  })
})

tape('Test can migrate questions', (t) => {
  migrate().then(() => {
    const Schema = require('../../../../server/db/schema.js')()

    Schema.models.Question.find({ order: 'question_id' }, (err, questions) => {
      t.ok(!err, 'No error')
      t.equal(questions.length, 47, 'There are 47 questions')

      questions.forEach((question) => {
        const actual = question
        const expected = raw.questions[question.question_id]
        t.equal(actual.question_id, expected.question_id, 'ID match: ' + actual.question_id)
        t.equal(
          actual.question_text, expected.question_text, 'Text matches: ' + actual.question_text
        )
      })

      Schema.client.flushdb(() => {
        Schema.client.quit()
        t.end()
      })
    })
  })
})
