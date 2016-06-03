'use strict'

require('chai').should()
const waterfall = require('async-waterfall')
const util = require('../../server/db/util.js')

require('../../assets/js/db/migrate.js')

const cookie = {}
let server

describe('User flow 1 async waterfall tests', () => {

  before((done) => {
    server = require('../../server/server.js')
    server.app.Schema.adapter.automigrate(done)
  })

  after((done) => {
    server.app.Schema.adapter.flushAll(() => {
      done()
    })
  })

  it('Should be able to create user by posting to signup endpoint & store cookie', (done) => {
    waterfall([
      function (next) {
        userSignUp(next, 'tom')
      },
      function (next) {
        newQu(next)
      },
      function (next) {
        createNewQuInDb(next)
      },
      function (QUID, next) {
        postFilledOutQuToAnswers(QUID, next)
      },
      function (QUID, next) {
        imposter(QUID, next)
      }
    ], (err) => {
      if (err)
        throw err
      done()
    })
  })
})

function userSignUp (next, username) {
  console.log(username, typeof next)
  server.inject({
    method: 'POST',
    url: '/api/signup',
    payload: {
      username: username,
      password: 'apples',
      confirm_password: 'apples',
      user_email: 'tomupton@gmail.com',
      clinic_email: 'roger@gmail.com',
      clinic_number: '07986534562'
    }
  }, (response) => {
    cookie[username] = response.headers['set-cookie'][0].split(';')[0]

    response.statusCode.should.equal(302)
    response.headers['set-cookie'][0].indexOf('token').should.be.at.least(0)
    response.headers.location.should.equal('/dashboard')

    server.app.User.find({ where: { user_name: username } }, (err, users) => {
      if (err)
        throw err

      users[0].user_name.should.equal(username)
      next()
    })
  })
}

function newQu (next) {
  server.inject({
    method: 'GET',
    url: '/questionnaires/new'
  }, (response) => {
    response.statusCode.should.equal(302)
    response.raw.res._hasBody.should.equal(true)
    next()
  })
}

function createNewQuInDb (next) {
  const cats = [1, 2, 3, 4]
  server.inject({
    method: 'POST',
    url: '/questionnaires/new/register',
    headers: {
      cookie: cookie.tom
    },
    payload: {
      categories: JSON.stringify(cats)
    }
  }, (response) => {
    response.statusCode.should.equal(302)
    response.headers.location.split('/')[2].should.equal('1')
    const QUID = response.headers.location.split('/')[2]
    util.getCategoriesByQuestionnaire(server.app.Schema, QUID)
      .then((categories) => {
        categories
          .map((el) => {return el.cat_id})
          .sort()
          .should.deep.equal(cats)
        next(null, QUID)
      })
      .catch((err) => {
        if (err)
          next(err)
      })
  })
}

function random (min, max) {
  return Math.floor(Math.random() * (max - min))
}

const objValues = function (obj) {
  return Object.keys(obj).map(key => obj[key])
}

function postFilledOutQuToAnswers (QUID, next) {
  util.getQuestionsByQuestionnaire(server.app.Schema, QUID).then((questions) => {
    const payObj = questions
      .map((el) => {return el.question_id})
      .reduce((acc, curr) => {
        acc['answer-' + curr] = random(0, 4)
        return acc
      }, {})
    server.inject({
      method: 'POST',
      url: '/questionnaires/'+QUID+'/answers',
      headers: {
        cookie: cookie.tom
      },
      payload: payObj
    }, (response) => {
      response.statusCode.should.equal(302)
      util.getAnswersByQuestionnaire(server.app.Schema, QUID)
        .then((answers) => {
          answers
          .map((el) => {return el.question_id.toString()})
          .should.deep.equal(Object.keys(payObj).map((el) => {return el.slice(7)}))

          answers
          .map((el) => {return el.answer.toString()})
          .should.deep.equal(objValues(payObj).map((el) => {return el.toString()}))
          next(null, QUID)
        })

        .catch((err) => {
          console.log('Error', err)
          next(err)
        })
    })
  })
}

function imposter (QUID, next) {
  console.log(QUID, typeof next)
  userSignUp(() => {
    util.getQuestionsByQuestionnaire(server.app.Schema, QUID).then((questions) => {
      const payObj = questions
        .map((el) => {return el.question_id})
        .reduce((acc, curr) => {
          acc['answer-' + curr] = random(0, 4)
          return acc
        }, {})

      server.inject({
        method: 'POST',
        url: '/questionnaires/' + QUID + '/answers',
        headers: {
          cookie: cookie.paddy
        },
        payload: payObj
      }, (response) => {
        response.statusCode.should.equal(302)
        response.raw.res._headers.location.should.equal('/questionnaires/new')
        next()

        .catch((err) => {
          console.log('Error', err)
          next(err)
        })
      })
    })
  }, 'paddy')
}
