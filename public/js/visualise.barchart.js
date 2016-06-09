/* global d3, $ */

var Visualisations = (function (V) {
  'use strict'

  if (!V || !V.Base)
    throw new Error('Visualisations base module must be preloaded')

  V.BarChart = (function () {
    var chart = Object.create(V.Base)

    var _data = null

    chart.init = function (data) {
      _data = data
      V.Base.init.call(this, _data)

      this.scale.x.rangeRoundBands([0, this.width.inner], 0.1)
      this.scale.y.range([this.height.inner, 0])
    }

    chart.render = function () {
      var that = this

      this.drawAxes()

      this.chart.selectAll('.chart')
        .data(_data)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function (d, i) {return that.scale.x(i)})
        .attr('y', function (d) {return that.scale.y(d.score)})
        .attr('height', function (d) {
          return that.height.inner - that.scale.y(d.score)
        })
        .attr('width', that.scale.x.rangeBand())
    }

    return chart
  })()

  return V
})(Visualisations)
