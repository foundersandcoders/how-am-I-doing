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

  $('.card').each(function (i, el) {
    $(el).click(function (e) {
      var cat_id = $(e.target).closest('.card').attr('id')
      container.innerHTML = ''

      if (cat_id && /\d+/.test(cat_id)) {
        drawVisualisation('cat_id=' + cat_id)
      } else {
        container.innerHTML = '' +
          '<span>' +
            'There was an error: ' +
            'No category ID attached to radio button.' +
            'Please try again.' +
          '<span>'
      }
    })
  })

  container.addEventListener('click', function () {
    container.innerHTML = ''
    displaying = nextChart[displaying]
    renderers[displaying]()
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
      })
      .fail(function (_, __, err) {
        console.error(err)
      })
  }
})(Visualisations)
