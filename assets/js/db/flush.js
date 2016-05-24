/*
* Flushes the database
*/
'use strict'

require('env2')('./config.env')

const Caminte = require('caminte')
const Schema = new Caminte.Schema(process.env.DB_DRIVER, {
  password: process.env.DB_PASSWORD,
  username: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  pool: true,
  database: +process.env.DB_NUMBER
})

// const User = require('../../../server/models/user.js')(Schema)
// const Question = require('../../../server/models/question.js')(Schema)
// const Questionnaire = require('../../../server/models/questionnaire.js')(Schema)
// const Category = require('../../../server/models/category.js')(Schema)

// const destroy = {
//   category: () => {
//     return new Promise((resolve, reject) => {
//       Category.destroyAll((err) => {
//         if (err)
//           return reject(err)
//
//         console.log('Destroyed all categories')
//         resolve()
//       })
//     })
//   },
//
//   question: () => {
//     return new Promise((resolve, reject) => {
//       Question.destroyAll((err) => {
//         if (err)
//           return reject(err)
//
//         console.log('Destroyed all questions')
//         resolve()
//       })
//     })
//   },
//
//   questionnaire: () => {
//     return new Promise((resolve, reject) => {
//       Questionnaire.destroyAll((err) => {
//         if (err)
//           return reject(err)
//
//         console.log('Destroyed all questionnaires')
//         resolve()
//       })
//     })
//   },
//
//   user: () => {
//     return new Promise((resolve, reject) => {
//       User.destroyAll((err) => {
//         if (err)
//           return reject(err)
//
//         console.log('Destroyed all users')
//         resolve()
//       })
//     })
//   },
// }
//
// if (process.argv.slice(2).indexOf('all') > -1) {
//
//   Promise.all(Object.keys(destroy).map((key) => destroy[key]()))
//     .then(() => {
//       Schema.client.quit()
//     })
//     .catch((err) => console.log('Error', err))
//
// } else {
//
//   Promise.all(process.argv.slice(2).map((arg) => {
//     return destroy[arg] ? destroy[arg]() : Promise.resolve(null)
//   }))
//     .then(() => Schema.client.quit())
//     .catch((err) => console.log('Error', err))
//
// }

Schema.client.flushdb(() => {
  Schema.client.quit()
})
