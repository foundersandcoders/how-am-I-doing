/* global d3, QUnit, createData */
'use strict'

QUnit.test('hello test', (assert) => {
  assert.ok(1 == '1', 'Passed!')
})

let c

const testData = [
  {
    questionnaire_id: 1,
    questionnaire_date: 1462111758000,
    questionnaire_answers: [
      0, 1, 2, 1, 3, 0, 0, 0, 1, 1
    ]
  }, {
    questionnaire_id: 2,
    questionnaire_date: 1462630158000,
    questionnaire_answers: [
      1, 1, 3, 0, 2, 1, 0, 0, 1, 1
    ]
  }, {
    questionnaire_id: 3,
    questionnaire_date: 1463321358000,
    questionnaire_answers: [
      0, 2, 2, 0, 1, 1, 0, 0, 0, 1
    ]
  }, {
    questionnaire_id: 4,
    questionnaire_date: 1463839758000,
    questionnaire_answers: [
      0, 1, 1, 0, 2, 1, 0, 0, 0, 1
    ]
  }
]

QUnit.module('bar chart', {

  beforeEach: function () {
    d3.selectAll('#target').append('svg').attr('class', 'chart')
    c = createBarChart(testData)
    c.render()
  },
  afterEach: function () {
    d3.selectAll('.chart').remove()    // clean up after each test
  }
})

QUnit.test('the svg should be created', (assert) => {
  function getChart () {
    return d3.select('.chart')
  }
  assert.notEqual(getChart(), null, 'svg definitely exists!')
  assert.equal(getChart().attr('width'), window.innerWidth, 'svg width is as expected')
  assert.equal(getChart().attr('height'), window.innerHeight / 2, 'svg height is as expected')
})

QUnit.test('bars can be created', (assert) => {
  function getBars () {
    return d3.selectAll('rect.bar')[0]
  }
  assert.equal(getBars().length, 4, 'should render the correct number of bars')
  assert.equal(d3.select(getBars()[0]).attr('x'), c.x(
    testData[0].questionnaire_answers.reduce((a, b) => {
      return a + b
    })),
  'should render the bars with correct x value')
  console.log(c.x)
  assert.equal(d3.select(getBars()[0]).attr('y'), 0,
  'should render the bars with correct y value')
})

// describe('create bars', function () {
//   it('should render the correct number of bars', function () {
//     expect(getBars().length).toBe(3)
//   })
//
//   it('should render the bars with correct height', function () {
//     expect(d3.select(getBars()[0]).attr('height')).toBeCloseTo(420)
//   })
//
//   it('should render the bars with correct x', function () {
//     expect(d3.select(getBars()[0]).attr('x')).toBeCloseTo(9)
//   })
//
//   it('should render the bars with correct y', function () {
//     expect(d3.select(getBars()[0]).attr('y')).toBeCloseTo(0)
//   })
// })


QUnit.test('the createData function should return an object', (assert) => {
  assert.ok(typeof createData(qDates, sum) === 'object', 'An object indeed!')
})
