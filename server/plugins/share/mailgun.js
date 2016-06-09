'use strict'

const mailgunjs = require('mailgun-js')
const isTesting = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'testing'

if (isTesting) {
  process.env.MAILGUN_API_KEY = 'fakekey'
  process.env.MAILGUN_DOMAIN = 'fakedomain'
}

const mailgun = mailgunjs({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
})

if (isTesting) {
  const sinon = require('sinon')
  sinon.stub(mailgun, 'messages', () => {
    return { send: (data, cb) => {cb(null, 'Stubbed response')} }
  })
}

module.exports = mailgun
