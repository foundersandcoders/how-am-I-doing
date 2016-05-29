/*
* Migrates the database using the data defined in data.questions.json
*/
'use strict'

require('env2')('./config.env')
const Bcrypt = require('bcrypt')

const Schema = require('../../../server/db/schema.js')()

require('../../../server/db/relations.js')(Schema)

function encrypt (pw) {
  return Bcrypt.hashSync(pw, 10)
}

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

    console.log('Inserting test user: -----------------')

    const users = new Promise((resolve, reject) => {
      Schema.models.User.create({
        user_name: 'test',
        user_email: 'a@a.com',
        user_secret: encrypt('password'),
        clinic_email: 'b@b.com',
        clinic_number: '12345678901'
      }, (err, user) => {
        if (err || !user)
          return reject(err)

        console.log('Created user: ' + user.user_name)
        resolve()
      })
    })

    Promise.all(cats.concat(quests).concat(users))
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
