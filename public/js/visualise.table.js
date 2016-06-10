/* global d3, $ */

var Visualisations = (function (V) {
  'use strict'

  if (!V || !V.Base)
    throw new Error('Visualisations base module must be preloaded')

  V.Table = (function () {
    var chart = Object.create(V.Base)
    var _data = null
    var labels = ['Date', 'Score']

    chart.init = function (data) {
      _data = data
    }

    chart.render = function () {
      var that = this
      var table = d3.select('.chart').append('table')
      var thead = table.append('thead')
      var tbody = table.append('tbody')

      thead.append('tr')
        .selectAll('th')
        .data(labels)
      .enter().append('th')
        .text(function (label) {return label})
        .attr('color', 'white')

      tbody.selectAll('tr')
        .data(_data)
      .enter().append('tr')
        .selectAll('td')
        .data(function (r) {
          return labels.map(function (label) {
            return { column: label, value: r[label.toLowerCase()] }
          })
        })
      .enter().append('td')
        .html(function (d) {
          return d.column === 'Date' ? that.formatDate(d.value) : d.value
        })
    }

    return chart
  })()

  return V
})(Visualisations)
