/* global d3, QUnit, createBarChart, createLineChart */
'use strict'

let c

const testData = [
  {
    id: 1,
    date: 1464688813000,
    answers: [
      {
        answer: 1,
        question_id: 4,
        id: 1,
        questionnaire_id: 1
      },
      {
        answer: 1,
        question_id: 7,
        id: 2,
        questionnaire_id: 1
      },
      {
        answer: 2,
        question_id: 8,
        id: 3,
        questionnaire_id: 1
      },
      {
        answer: 3,
        question_id: 12,
        id: 4,
        questionnaire_id: 1
      },
      {
        answer: 1,
        question_id: 20,
        id: 5,
        questionnaire_id: 1
      },
      {
        answer: 0,
        question_id: 30,
        id: 6,
        questionnaire_id: 1
      },
      {
        answer: 2,
        question_id: 32,
        id: 7,
        questionnaire_id: 1
      },
      {
        answer: 0,
        question_id: 38,
        id: 8,
        questionnaire_id: 1
      },
      {
        answer: 2,
        question_id: 43,
        id: 9,
        questionnaire_id: 1
      }
    ],
    score: 12
  },
  {
    id: 2,
    date: 1464780664000,
    answers: [
      {
        answer: 1,
        question_id: 3,
        id: 10,
        questionnaire_id: 2
      },
      {
        answer: 3,
        question_id: 14,
        id: 11,
        questionnaire_id: 2
      },
      {
        answer: 0,
        question_id: 24,
        id: 12,
        questionnaire_id: 2
      },
      {
        answer: 3,
        question_id: 26,
        id: 13,
        questionnaire_id: 2
      },
      {
        answer: 1,
        question_id: 28,
        id: 14,
        questionnaire_id: 2
      },
      {
        answer: 2,
        question_id: 34,
        id: 15,
        questionnaire_id: 2
      },
      {
        answer: 0,
        question_id: 36,
        id: 16,
        questionnaire_id: 2
      },
      {
        answer: 3,
        question_id: 39,
        id: 17,
        questionnaire_id: 2
      },
      {
        answer: 0,
        question_id: 41,
        id: 18,
        questionnaire_id: 2
      }
    ],
    score: 13
  },
  {
    id: 3,
    date: 1464780705000,
    answers: [
      {
        answer: 0,
        question_id: 5,
        id: 19,
        questionnaire_id: 3
      },
      {
        answer: 0,
        question_id: 9,
        id: 20,
        questionnaire_id: 3
      },
      {
        answer: 1,
        question_id: 17,
        id: 21,
        questionnaire_id: 3
      },
      {
        answer: 2,
        question_id: 18,
        id: 22,
        questionnaire_id: 3
      },
      {
        answer: 3,
        question_id: 33,
        id: 23,
        questionnaire_id: 3
      },
      {
        answer: 0,
        question_id: 45,
        id: 24,
        questionnaire_id: 3
      },
      {
        answer: 1,
        question_id: 46,
        id: 25,
        questionnaire_id: 3
      }
    ],
    score: 7
  }
]

QUnit.module('bar chart', {

  beforeEach: function () {
    c = createBarChart(testData)
    c.render()
  },
  afterEach: function () {
    d3.select('.chart').selectAll('*').remove()    // clean up after each test
    return true
  }
})

QUnit.test('the svg should be created', (assert) => {
  function getChart () {
    return d3.select('.chart svg')
  }
  assert.notEqual(getChart(), null, 'svg definitely exists!')

  console.log(getChart())
  assert.equal(getChart().attr('width'),
  Math.min(window.innerWidth, 800), 'svg width is as expected')

  assert.equal(getChart().attr('height'),
  Math.min(window.innerHeight, 800) / 2, 'svg height is as expected')
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
