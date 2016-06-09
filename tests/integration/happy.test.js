'use strict'

const should = require('chai').should()
const waterfall = require('async-waterfall')
const utils = require('../helpers/utils.js')
const migrate = require('../../assets/js/db/migrate.js')
const setupHelpers = require('../helpers/index.js')
let helpers
const raw = {
  questions: require('../../assets/data.questions.json'),
  categories: require('../../assets/data.categories.json'),
}

let server = null
let Schema = null

describe('Happy path integration tests', () => {
  before((done) => {
    migrate(() => {
      server = require('../../server/server.js')
      Schema = server.app.Schema
      helpers = setupHelpers(server)
      done()
    })
  })

  after((done) => {
    Schema.adapter.flushAll(() => {
      server = null
      Schema = null
      done()
    })
  })

  afterEach((done) => {
    const models = [
      'User',
      'Questionnaire',
      'QuestionnaireAnswers',
      'QuestionnaireCategories'
    ]

    Promise.all(models.map((model) => {
      return new Promise((resolve, reject) => {
        Schema.adapter.destroyAll(model, (err) => err ? reject(err) : resolve())
      })
    }))
      .then(() => done())
      .catch((err) => {throw err})
  })

  it('1. About page', (done) => {
    waterfall([
      // 1.1.0 Navigate to home page
      (next) => {
        helpers.public.index({}, (response) => {
          next(null, response)
        })
      },
      // 1.1.1 Assertions
      (response, next) => {
        response.statusCode.should.equal(200)
        next()
      },

      // 1.2.0 Navigate to about page
      (next) => {
        helpers.public.about({}, (response) => {
          next(null, response)
        })
      },
      // 1.2.1 Assertions
      (response, next) => {
        response.statusCode.should.equal(200)
        next()
      }
    ], (err) => {
      if (err) throw err
      done()
    })
  })

  it('2. Signup and complete questionnaire', (done) => {
    const user = {}
    user.username = utils.randstr(6)
    user.password = utils.randstr(11)
    user.confirm_password = user.password

    const header = { cookie: null }

    waterfall([
      // 2.1.0 Signup for an account
      (next) => {
        helpers.auth.signup(user, (response) => {
          next(null, response)
        })
      },
      // 2.1.1 Assertions
      (response, next) => {
        response.statusCode.should.equal(302)
        response.headers.location.should.equal('/dashboard')
        should.exist(response.headers['set-cookie'])

        const cookieParts = response.headers['set-cookie'][0]
          .split(';')
          .map((a) => a.trim())
        cookieParts[0].search('token=').should.equal(0)
        cookieParts.indexOf('HttpOnly').should.be.at.least(0)
        cookieParts.indexOf('Domain=localhost').should.be.at.least(0)
        cookieParts.indexOf('Path=/').should.be.at.least(0)

        header.cookie = cookieParts[0]
        helpers = setupHelpers(server, header)

        Schema.models.User.find({
          where: { user_name: user.username }
        }, (err, users) => {
          if (err || !users || users.length < 1)
            return next(err)

          users.length.should.equal(1)
          users[0].user_name.should.equal(user.username)
          next()
        })
      },

      // 2.2.0 Navigate to new questionnaire
      (next) => {
        helpers.questionnaire.get.new({}, (response) => {
          next(null, response)
        })
      },
      // 2.2.1 Assertions
      (response, next) => {
        response.statusCode.should.equal(200)
        raw.categories.forEach((category) => {
          response.result.indexOf(category.cat_name).should.be.at.least(0)
        })
        next()
      },

      // 2.3.0 Register new questionnaire
      (next) => {
        const categoryIDs = [utils.randnum(1, 6)]
        helpers.questionnaire.post.register({
          categories: JSON.stringify(categoryIDs)
        }, (response) => {
          next(null, categoryIDs, response)
        })
      },
      // 2.3.1 Assertions
      (categoryIDs, response, next) => {
        const QUID = 1
        response.statusCode.should.equal(302)
        response.headers.location.should.equal('/questionnaires/' + QUID + '/questions')

        Schema.models.QuestionnaireCategories.find({
          where: { questionnaire_id: QUID }
        }, (err, questCats) => {
          if (err || !questCats)
            return next(err)

          questCats.length.should.equal(categoryIDs.length)

          const dbCategories = questCats.map((qc) => qc.cat_id).sort()
          dbCategories.should.deep.equal(categoryIDs.sort())
          next(null, categoryIDs, QUID)
        })
      },

      // 2.4.0 Visit questions page
      (categoryIDs, QUID, next) => {
        helpers.questionnaire.get.questions({ QUID }, (response) => {
          next(null, categoryIDs, QUID, response)
        })
      },
      // 2.4.1 Assertions
      (categoryIDs, QUID, response, next) => {
        const questions = {
          display: raw.questions.filter((question) => {
            return categoryIDs.indexOf(question.cat_id) > -1
          }),

          nodisplay: raw.questions.filter((question) => {
            return categoryIDs.indexOf(question.cat_id) === -1
          })
        }
        questions.display.forEach((question) => {
          const text = question.question_text.replace('\'', '&#x27;')
          response.result.indexOf(text).should.be.at.least(0)
        })

        questions.nodisplay.forEach((question) => {
          response.result.indexOf(question.question_text).should.be.equal(-1)
        })

        next(null, QUID, questions.display)
      },

      // 2.5.0 Answer questions
      (QUID, questions, next) => {
        const answers = questions.reduce((acc, curr) => {
          acc['answer-' + curr.question_id] = utils.randnum(0, 3)
          return acc
        }, {})

        const payload = Object.assign(answers, { QUID })
        helpers.questionnaire.post.answer(payload, (response) => {
          next(null, QUID, questions, answers, response)
        })
      },
      // 2.5.1 Assertions
      (QUID, questions, answers, response, next) => {
        response.statusCode.should.equal(302)
        response.headers.location.should.equal('/questionnaires/' + QUID + '/summary')

        Schema.models.QuestionnaireAnswers.find({
          where: { questionnaire_id: QUID }
        }, (err, dbAnswers) => {
          if (err || !dbAnswers)
            return next(err)

          dbAnswers.length.should.equal(Object.keys(answers).length)
          dbAnswers.forEach((dbAns) => {
            answers['answer-' + dbAns.question_id].should.equal(dbAns.answer)
          })
          next(null, QUID, questions, dbAnswers)
        })
      },

      // 2.6.0 Get summary
      (QUID, questions, answers, next) => {
        helpers.questionnaire.get.summary({ QUID }, (response) => {
          next(null, QUID, questions, answers, response)
        })
      },
      // 2.6.1 Assertions
      (QUID, questions, answers, response, next) => {
        response.statusCode.should.equal(200)

        const answerMap = { 0: 'Never', 1: 'Sometimes', 2: 'Often', 3: 'Always' }
        const summary = questions
          .sort((a, b) => a.id - b.id)
          .map((question) => {
            question.answer = answers.filter((a) => a.question_id === question.question_id)[0]
            question.answer = answerMap[question.answer.answer]
            return question
          })

        const summaryElements = response.result.split('<li>').slice(1, -1)
        summaryElements.forEach((qSummary, i) => {
          const text = summary[i].question_text.replace('\'', '&#x27;')
          qSummary.indexOf(text).should.be.at.least(0)
          qSummary.indexOf(summary[i].answer).should.be.at.least(0)
        })

        next(null, QUID)
      },

      // 2.7.0 Mark questionnaire as complete
      (QUID, next) => {
        helpers.questionnaire.post.complete({ QUID }, (response) => {
          next(null, QUID, response)
        })
      },
      // 2.7.1 Assertions
      (QUID, response, next) => {
        response.statusCode.should.equal(302)
        response.headers.location.should.equal('/dashboard')

        Schema.models.Questionnaire.findById(QUID, (err, questionnaire) => {
          if (err)
            next(err)

          questionnaire.completed.should.equal(true)
          next()
        })
      }
    ], (err) => {
      if (err)
        throw err
      done()
    })
  })

  it('3. Share questionnaire data', (done) => {
    const user = {}
    user.username = utils.randstr(5)
    user.password = utils.randstr(8)
    user.confirm_password = user.password

    const headers = { cookie: null }

    waterfall([
      // Create user
      (next) => {
        helpers.auth.signup(user, (response) => {
          response.statusCode.should.equal(302)
          response.headers.location.should.equal('/dashboard')
          next()
        })
      },

      // Login as user
      (next) => {
        helpers.auth.login({ username: user.username, password: user.password }, (response) => {
          response.statusCode.should.equal(302)
          response.headers.location.should.equal('/dashboard')

          const cookieParts = response.headers['set-cookie'][0]
            .split(';')
            .map((a) => a.trim())
          cookieParts[0].search('token=').should.equal(0)
          cookieParts.indexOf('HttpOnly').should.be.at.least(0)
          cookieParts.indexOf('Domain=localhost').should.be.at.least(0)
          cookieParts.indexOf('Path=/').should.be.at.least(0)

          headers.cookie = cookieParts[0]
          helpers = setupHelpers(server, headers)
          next()
        })
      },

      // Register new questionnaire
      (next) => {
        const categoryIDs = [utils.randnum(1, 6)]
        const QUID = 2
        helpers.questionnaire.post.register({
          categories: JSON.stringify(categoryIDs)
        }, (response) => {
          response.statusCode.should.equal(302)
          response.headers.location.should.equal('/questionnaires/' + QUID + '/questions')
          next(null, QUID, categoryIDs)
        })
      },

      // Answer questions
      (QUID, categoryIDs, next) => {
        const questions = raw.questions.filter((question) => {
          return categoryIDs.indexOf(question.cat_id) > -1
        })

        const payload = questions.reduce((acc, curr) => {
          acc['answer-' + curr.question_id] = utils.randnum(0, 3)
          return acc
        }, {})
        payload.QUID = QUID

        helpers.questionnaire.post.answer(payload, (response) => {
          response.statusCode.should.equal(302)
          response.headers.location.should.equal('/questionnaires/' + QUID + '/summary')
          next(null, QUID)
        })
      },

      // Complete questionnaire
      (QUID, next) => {
        helpers.questionnaire.post.complete({ QUID }, (response) => {
          response.statusCode.should.equal(302)
          response.headers.location.should.equal('/dashboard')
          next(null, QUID)
        })
      },

      // Try to share questionnaire
      (QUID, next) => {
        helpers.share({ QUID }, (response) => {
          const payload = JSON.parse(response.payload)
          payload.success.should.equal(false)
          should.equal(payload.error, null)
          next(null, QUID)
        })
      },

      // Add clinician email
      (QUID, next) => {
        helpers.account({
          clinic_email: 'example@boom.com',
          confirm_clinic_email: 'example@boom.com',
        }, (response) => {
          response.statusCode.should.equal(302)
          response.headers.location.should.equal('/account')
          next(null, QUID)
        })
      },

      // Try to share again
      (QUID, next) => {
        helpers.share({ QUID }, (response) => {
          response.statusCode.should.equal(200)
          const payload = JSON.parse(response.payload)
          payload.success.should.equal(true)
          should.equal(payload.error, null)
          payload.body.should.equal('Stubbed response')
          next()
        })
      }
    ], (err) => {
      if (err)
        throw err
      done()
    })
  })
})
