/*
* Migrates the database using the data defined in data.questions.json
*/
'use strict'

require('env2')('./config.env')

const Schema = require('../../../server/db/schema.js')()

require('../../../server/db/relations.js')(Schema)

const raw = {
  questions: require('../../../data.questions.json'),
  categories: require('../../../data.categories.json'),
}

console.log('Categories: -----------------')

const categories = raw.categories.map((cat) => {
  const c = new Schema.models.Category()
  c.cat_id = cat.cat_id
  c.cat_name = cat.cat_name
  c.cat_long_name = cat.cat_long_name
  console.log('Creating category:', cat.cat_name)
  return c
})

module.exports = Promise.all(categories.map((cat) => {
  return new Promise((resolve, reject) => {
    cat.save((err) => {
      if (err) {
        console.log('There was an error')
        return reject(err)
      }

      return resolve(cat)
    })
  })
}))
  .then((cats) => {
    return Promise.all(
      cats.map((cat) => {
        const qs4ct = getQuestionsByCatId(cat.cat_id)
        console.log('Got', qs4ct.length, 'questions for', cat.cat_name)

        return Promise.all(
          qs4ct.map((question) => {
            const q = Object.assign({}, question)
            delete q.category_id
            return new Promise((resolve, reject) => {
              cat.question.create(q, (error) => {
                return error ? reject(error) : resolve(cat)
              })
            })
          })
        )
      })
    )
  })
  .then(() => {
    console.log('Successfully created all categories')
    Schema.client.quit()
    return Promise.resolve(null)
  })
  .catch((err) => {
    console.log('ERROR', err)
    Schema.client.quit()
  })


function getQuestionsByCatId (id) {
  return raw.questions.filter((question) => question.category_id === id)
}
