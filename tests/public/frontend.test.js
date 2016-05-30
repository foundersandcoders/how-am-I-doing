/* global d3, QUnit, createBarChart, createLineChart */
'use strict'

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

  getBars().forEach((bar, i) => {
    const result = +d3.select(bar).attr('y')
    const expected = c.y(testData[i].questionnaire_answers.reduce((a, b) => {
      return a + b
    }))
    console.log(i, result)
    assert.equal(result, expected, 'should render the bars with correct y value')
  })
})

QUnit.test('axes are created', (assert) => {
  function getXAxis () {
    return d3.selectAll('g.x.axis')[0]
  }
  let axis = getXAxis()
  console.log(axis)
  assert.equal(axis.length, 1, 'x axis is created')

  function getYAxis () {
    return d3.selectAll('g.y.axis')[0]
  }
  axis = getYAxis()
  assert.equal(axis.length, 1, 'y axis is created')
})

QUnit.module('line chart', {

  beforeEach: function () {
    d3.selectAll('#target').append('svg').attr('class', 'chart')
    c = createLineChart(testData)
    c.render()
  },
  afterEach: function () {
    d3.selectAll('.chart').remove()    // clean up after each test
  }
})

QUnit.test('a line created', (assert) => {
  function getPoints () {
    return d3.selectAll('path.line')[0]
  }

  const yVals = d3.select(getPoints()[0]).attr('d')
    .split(/[A-Z]/)
    .map((pair) => pair.split(',')[1])
    .filter((e) => e).map((e) => +e)

  const expected = testData.map((data) => {
    return c.y(data.questionnaire_answers.reduce((a, b) => a + b))
  })
  assert.deepEqual(yVals, expected, 'should render a line with correct y values')
  assert.equal(yVals.length, 4, 'should render the correct number of points on the line')
})

QUnit.test('axes are created', (assert) => {
  function getXAxis () {
    return d3.selectAll('g.x.axis')[0]
  }
  let axis = getXAxis()
  console.log(axis)
  assert.equal(axis.length, 1, 'x axis is created')

  function getYAxis () {
    return d3.selectAll('g.y.axis')[0]
  }
  axis = getYAxis()
  assert.equal(axis.length, 1, 'y axis is created')
})
