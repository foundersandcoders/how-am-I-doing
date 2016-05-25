/*
* Migrates the database using the data defined in data.questions.json
*/
'use strict'

require('env2')('./config.env')

const Schema = require('../../../server/db/schema.js')()

require('../../../server/db/relations.js')(Schema)

const raw = {
  questions: require('../../data.questions.json'),
  categories: require('../../data.categories.json'),
}

const insertData = process.argv.slice(2).indexOf('-p') === -1

console.log('Arguments: ', process.argv.slice(2))

console.log('Starting Migration')

Schema.adapter.automigrate(() => {
  console.log('Initialisation complete')

  if (insertData) {
    console.log('Inserting Categories: -----------------')

    const cats = raw.categories.map((cat) => {
      return new Promise((resolve, reject) => {
        Schema.models.Category.create(cat, (err) => {
          if (err)
            return reject(err)

          console.log('Created category ' + cat.cat_name)
          resolve()
        })
      })
    })

    console.log('Inserting Questions: -----------------')

    const quests = raw.questions.map((question) => {
      return new Promise((resolve, reject) => {
        Schema.models.Question.create(question, (err) => {
          if (err)
            return reject(err)

          console.log('Created question ' + question.question_id)
          resolve()
        })
      })
    })

    Promise.all(cats.concat(quests))
      .then(() => {
        console.log('Migration completed successfully')
        console.log('Disconnecting')
        Schema.client.end()
      })
      .catch((err) => {throw err})
  } else {

    Schema.client.end()

  }
})
