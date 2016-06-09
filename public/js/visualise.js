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

  $('input[type=radio]').each(function (i, el) {
    $(el).click(function (e) {
      container.innerHTML = ''
      var query = 'cat_id=' + e.target.id
      drawVisualisation(query)
    })
  })

  function drawVisualisation (query) {
    var url = query ? '/api/questionnaires?' + query : '/api/questionnaires'
    $.get(url)
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
  }
})(Visualisations)
