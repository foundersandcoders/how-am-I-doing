/* global d3, $, Visualisations */

(function (V) {
  'use strict'

  if (! V || ! V.BarChart || ! V.LineChart || ! V.Table)
    throw new Error('Visualisations not loaded')

  var container = document.querySelector('.chart')
  var displaying = 'bar'
  var renderers = {
    bar: function () {V.BarChart.render()},
    line: function () {V.LineChart.render()},
    table: function () {V.Table.render()},
  }
  var nextChart = {
    bar: 'line',
    line: 'table',
    table: 'bar',
  }

  $.get('/api/questionnaires/scores')
    .done(function (raw) {
      var data = raw.map(function (qs) {
        return {
          date: new Date(qs.date),
          score: qs.score,
        }
      })

      V.BarChart.init(data)
      V.LineChart.init(data)
      V.Table.init(data)

      renderers[displaying]()

      container.addEventListener('click', function () {
        container.innerHTML = ''
        displaying = nextChart[displaying]
        renderers[displaying]()
      })
    })
    .fail(function (_, __, err) {
      console.error(err)
    })
})(Visualisations)
