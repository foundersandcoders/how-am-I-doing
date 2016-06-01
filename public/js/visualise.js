/* global d3 */


  var dummyData = [
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

  var answerCreator = function (data) {
    'use strict'
    var qAnswers = data.map(function (el) {
      return el.questionnaire_answers
    })
    var sum = qAnswers.map(function (el) {
      return el.reduce(function (a, b) {
        return a + b
      })
    })
    return sum
  }

  var dateCreator = function (data) {
    'use strict'
    var qDates = data.map(function (el) {
      return new Date(el.questionnaire_date)
    })
    return qDates
  }

  var createData = function (dateArr, sumArr) {
    'use strict'
    var a = dateArr.map(function (date) {
      return { date: date }
    })
    sumArr.forEach(function (val, i) {
      a[i].val = val
    })
    return a
  }

  var formatDate = d3.time.format('%a %d/%m/%Y')

  var margin = { top: 20, right: 30, bottom: 30, left: 40 },
    width = Math.min(window.innerWidth, 800) - margin.left - margin.right,
    height = Math.min(window.innerHeight, 800) / 2 - margin.top - margin.bottom


  var createBarChart = function (data) {
    'use strict'
    var inFunc = {}

    var sum = answerCreator(data)

    var qDates = dateCreator(data)

    inFunc.x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1)
    .domain(qDates)

    inFunc.y = d3.scale.linear()
    .range([height, 0])
    .domain([0, d3.max(sum)])

    inFunc.render = function () {
      var xAxis = d3.svg.axis()
      .scale(inFunc.x)
      .orient('bottom')
      .tickFormat(function (d) {return formatDate(new Date(d))})
      .ticks(4)

      var yAxis = d3.svg.axis()
      .scale(inFunc.y)
      .orient('left')

      var chart = d3.select('.chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      chart.append('g')
      .attr('class', 'x axis bar')
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
      .attr('x', function (d) {return inFunc.x(d.date)})
      .attr('y', function (d) {return inFunc.y(d.val)})
      .attr('height', function (d) {return height - inFunc.y(d.val)})
      .attr('width', inFunc.x.rangeBand())

    }
    return inFunc
  }

  var createLineChart = function (data) {
    'use strict'
    var inFunc = {}

    var sum = answerCreator(data)

    var qDates = dateCreator(data)

    var datei = createData(qDates, sum)
    console.log(datei)

    inFunc.x = d3.time.scale()
        .domain(d3.extent(datei, function (d) {return d.date}))
        .range([0, width])
        .nice()

    inFunc.y = d3.scale.linear()
        .domain([0, d3.max(datei, function (d) {return d.val})])
        .range([height, 0])

    inFunc.render = function () {
      var xAxis = d3.svg.axis()
        .scale(inFunc.x)
        .orient('bottom')
        .tickFormat(function (d) {return formatDate(new Date(d))})
        .ticks(4)

      var yAxis = d3.svg.axis()
        .scale(inFunc.y)
        .orient('left')

      var line = d3.svg.line()
        .x(function (d) {return inFunc.x(d.date)})
        .y(function (d) {return inFunc.y(d.val)})

      var chart = d3.select('.chart')
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
          .attr('d', line(datei))
    }
    return inFunc
  }

  createBarChart(dummyData).render()

  var isDisplayingBar = true

  document.getElementsByClassName('chart')[0].addEventListener('click', function () {
    'use strict'
    document.getElementsByClassName('chart')[0].innerHTML = ''
    if (isDisplayingBar) {
      createLineChart(dummyData).render()
      isDisplayingBar = false
    } else {
      createBarChart(dummyData).render()
      isDisplayingBar = true
    }
  })
