/* global d3 */
'use strict'

const dummyData = [
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


const createBarChart = (data) => {
  const qAnswers = data.map((el) => {
    return el.questionnaire_answers
  })

  const formatDate = d3.time.format('%a %d/%m/%Y')

  const qDates = data.map((el) => {
    return new Date(el.questionnaire_date)
  })

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

  const margin = { top: 20, right: 30, bottom: 30, left: 40 },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight / 2 - margin.top - margin.bottom

  const inFunc = {}

  inFunc.x = d3.scale.ordinal()
  .rangeRoundBands([0, width], 0.1)
  .domain(qDates)

  inFunc.y = d3.scale.linear()
  .range([height, 0])
  .domain([0, d3.max(sum)])

  inFunc.render = () => {
    const xAxis = d3.svg.axis()
    .scale(inFunc.x)
    .orient('bottom')
    .tickFormat((d) => formatDate(new Date(d)))
    .ticks(4)

    const yAxis = d3.svg.axis()
    .scale(inFunc.y)
    .orient('left')

    const chart = d3.select('.chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    chart.append('g')
    .attr('class', 'bax axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

    chart.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('Total')

    chart.selectAll('.chart')
    .data(createData(qDates, sum))
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', (d) => {return inFunc.x(d.date)})
    .attr('y', (d) => {return inFunc.y(d.val)})
    .attr('height', (d) => {return height - inFunc.y(d.val)})
    .attr('width', inFunc.x.rangeBand())

  }
  return inFunc
}

const createLineChart = () => {
  const margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight / 2 - margin.top - margin.bottom

  const data = createData(qDates, sum)

  const x = d3.time.scale()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, width])
      .nice()

  const y = d3.scale.linear()
      .domain([0, d3.max(data, (d) => d.val)])
      .range([height, 0])

  const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .tickFormat((d) => formatDate(new Date(d)))
      .ticks(4)

  const yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')

  const line = d3.svg.line()
      .x((d) => x(d.date))
      .y((d) => y(d.val))

  const chart = d3.select('.chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

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
        .attr('class', 'line')
        .attr('d', line(data))
}

createBarChart().render()

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
