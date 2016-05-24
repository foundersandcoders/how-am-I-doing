/* global d3 */
'use strict'

const dummyData = [
  {
    'questionnaire_id': 1,
    'questionnaire_date': 1462111758000,
    'questionnaire_answers': [
      0, 1, 2, 1, 3, 0, 0, 0, 1, 1
    ]
  }, {
    'questionnaire_id': 2,
    'questionnaire_date': 1462630158000,
    'questionnaire_answers': [
      1, 1, 3, 0, 2, 1, 0, 0, 1, 1
    ]
  }, {
    'questionnaire_id': 3,
    'questionnaire_date': 1463321358000,
    'questionnaire_answers': [
      0, 2, 2, 0, 1, 1, 0, 0, 0, 1
    ]
  }, {
    'questionnaire_id': 4,
    'questionnaire_date': 1463839758000,
    'questionnaire_answers': [
      0, 1, 1, 0, 2, 1, 0, 0, 0, 1
    ]
  }
]


const qAnswers = dummyData.map((el) => {
  return el.questionnaire_answers
})


const qDates = dummyData.map((el) => {
  const dateArr = new Date(el.questionnaire_date).toString().split(' ')
  return dateArr[0] + ' ' + dateArr[1] + ' ' + dateArr[2] + ' ' + dateArr[3]
})

const formatDate = d3.time.format('%a/%b/%d/%Y')
console.log(formatDate(new Date(1463839758000)))


// const formatDate = d3.time.format('%d-%b-%y')

// const qDates = dummyData.map((el) => {
//   return new Date(el.questionnaire_date)
// })

const sum = qAnswers.map((el) => {
  return el.reduce((a, b) => {
    return a + b
  })
})

const createData = (dateArr, sumArr) => {
  const a = dateArr.map((date) => {
    return { date }
  })
  sumArr.forEach((val, i) => {
    a[i].val = val
  })
  return a
}

const createBarChart = () => {
  const margin = { top: 20, right: 30, bottom: 30, left: 40 },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight / 2 - margin.top - margin.bottom

  const x = d3.scale.ordinal()
      .rangeRoundBands([0, width], 0.1)

  const y = d3.scale.linear()
      .range([height, 0])

  const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')

  const yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')

  const chart = d3.select('.chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')


  x.domain(qDates)
  y.domain([0, d3.max(sum)])

  chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .append('text')
        .attr('transform', null)
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Date')

  chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('transform', null)
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'center')
        .text('Total')

  chart.selectAll('.chart')
        .data(createData(qDates, sum))
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => {return x(d.date)})
        .attr('y', (d) => {return y(d.val)})
        .attr('height', (d) => {return height - y(d.val)})
        .attr('width', x.rangeBand())
}

const createLineChart = () => {
  const margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight / 2 - margin.top - margin.bottom

  const x = d3.time.scale()
      .range([0, width])

  const y = d3.scale.linear()
      .range([height, 0])

  const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')

  const yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')

  const line = d3.svg.line()
      .x(function (d) {return x(d.date)})
      .y(function (d) {return y(d.val)})

  const chart = d3.select('.chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  x.domain(d3.extent(createData(qDates, sum), function (d) {return d.date}))
  y.domain(d3.extent(createData(qDates, sum), function (d) {return d.val}))

  chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .append('text')
        .attr('transform', null)
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Date')

  chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Total')

  chart.append('path')
        .datum(createData(qDates, sum))
        .attr('class', 'line')
        .attr('d', line)
}

createBarChart()

let isDisplayingBar = true

document.getElementsByClassName('chart')[0].addEventListener('click', () => {
  document.getElementsByClassName('chart')[0].innerHTML = ''
  if (isDisplayingBar) {
    createLineChart()
    isDisplayingBar = false
  } else {
    createBarChart()
    isDisplayingBar = true
  }
})
