'use strict'
const should = require('chai').should()
const createSchema = require('../../../server/db/schema.js')


describe('Test schema and database read/write', () => {
  const Schema = createSchema()

  after((done) => {
    Schema.adapter.dropAllTables(() => {
      Schema.client.end()
      done()
    })
  })

  beforeEach((done) => {
    Schema.adapter.automigrate(done)
  })

  it('Can create data models', (done) => {
    should.exist(Schema.models.User)
    should.exist(Schema.models.Question)
    should.exist(Schema.models.Questionnaire)
    should.exist(Schema.models.Category)
    done()
  })

  it('Can write a model', (done) => {
    Schema.models.Question.create({
      question_id: 1,
      question_text: 'Some text'
    }, (err, question) => {
      if (err)
        throw err

      question.question_id.should.equal(1)
      question.question_text.should.equal('Some text')
      done()
    })
  })
})
