/* global d3, $ */

var answerCreator = function (data) {
  'use strict'
  var qAnswers = data.map(function (el) {
    return el.score
  })
  return qAnswers
}

var dateCreator = function (data) {
  'use strict'
  var qDates = data.map(function (el) {
    return new Date(el.date)
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

var formatDate = d3.time.format('%d/%m/%Y')

var margin = { top: 20, right: 40, bottom: 30, left: 40 },
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
    var chart = d3.select('.chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var xAxis = d3.svg.axis()
      .scale(inFunc.x)
      .orient('bottom')
      .tickFormat(function (d) {
        return formatDate(new Date(d))
      })
      .ticks(4)

    var yAxis = d3.svg.axis()
      .scale(inFunc.y)
      .orient('left')

    chart.append('g')
      .attr('class', 'x axis bar-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)

    chart.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('y', -21)
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

//////LINE Chart

var createLineChart = function (data) {
  'use strict'
  var inFunc = {}
  var sum = answerCreator(data)
  var qDates = dateCreator(data)
  var datei = createData(qDates, sum)

  inFunc.x = d3.scale.ordinal()
    .domain(datei.map(function (d, i) {return i}))
    .rangePoints([0, width])

  inFunc.y = d3.scale.linear()
    .domain([0, d3.max(datei, function (d) {return d.val})])
    .range([height, 0])

  var line = d3.svg.line()
    .x(function (d, i) {return inFunc.x(i)})
    .y(function (d) {return inFunc.y(d.val)})

  inFunc.render = function () {

    var chart = d3.select('.chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var xAxis = d3.svg.axis()
      .scale(inFunc.x)
      .orient('bottom')
      .tickFormat(function (d) {return formatDate(new Date(qDates[d]))})
      .ticks(data.length)

    var yAxis = d3.svg.axis()
      .scale(inFunc.y)
      .orient('left')

    chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)

    chart.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('y', -21)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Total')

    chart.append('path')
      .attr('class', 'line')
      .attr('d', line(datei))

    chart.selectAll('.dot')
      .data(datei)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', line.x())
      .attr('cy', line.y())
      .attr('r', 3.5)
      .attr('color')
  }
  return inFunc
}


///// TABLE chart

function tabulate (data, columns) {
  'use strict'
  var inFunc = {}

  var sum = answerCreator(data)
  var qDates = dateCreator(data)
  var datei = createData(qDates, sum)

  inFunc.render = function () {
    var table = d3.select('.chart').append('table'),
      thead = table.append('thead'),
      tbody = table.append('tbody')

    // append the header row
    thead.append('tr')
      .selectAll('th')
      .data(columns)
      .enter()
      .append('th')
      .text(function (column) {return column})
      .attr('color')

    // create a row for each object in the data
    var rows = tbody.selectAll('tr')
      .data(datei)
      .enter()
      .append('tr')

    // create a cell in each row for each column
    rows.selectAll('td')
      .data(function (row) {
        return columns.map(function (column) {
          var colmap = { Date: 'date', Score: 'val' }
          return { column: column, value: row[colmap[column]] }
        })
      })
      .enter()
      .append('td')
      .html(function (d) {
        if (d.column === 'Date') return formatDate(d.value)
        return d.value
      })

  }
  return inFunc
}

$.get('/api/questionnaires/scores')
  .done(function (data) {
    'use strict'
    if (data.length > -1) {
      createBarChart(data).render()

      var isDisplayingBar = 0

      document.getElementsByClassName('chart')[0].addEventListener('click', function () {
        document.getElementsByClassName('chart')[0].innerHTML = ''
        if (isDisplayingBar === 0) {
          createLineChart(data).render()
          isDisplayingBar = 1
        } else if (isDisplayingBar === 1) {
          tabulate(data, ['Date', 'Score']).render()
          isDisplayingBar = 2
        } else if (isDisplayingBar === 2) {
          createBarChart(data).render()
          isDisplayingBar = 0
        }
      })
    } else {throw new Error('no data')}
  })
  .fail(function (_, __, err) {
    'use strict'
    console.log(err)
  })
