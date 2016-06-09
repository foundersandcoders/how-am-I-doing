/* global d3, $ */

var Visualisations = (function (V) {
  'use strict'

  if (!V || !V.Base)
    throw new Error('Visualisations base module must be preloaded')

  V.LineChart = (function () {
    var chart = Object.create(V.Base)

    var _data = null

    chart.init = function (data) {
      _data = data
      V.Base.init.call(this, _data)

      this.scale.x.rangePoints([0, this.width.inner])
      this.scale.y.range([this.height.inner, 0])
    }

    chart.render = function () {
      var that = this

      this.drawAxes()

      var line = d3.svg.line()
        .x(function (d, i) {return that.scale.x(i)})
        .y(function (d) {return that.scale.y(d.score)})

      this.chart.append('path')
        .attr('class', 'line')
        .attr('d', line(_data))

      this.chart.selectAll('.dot')
        .data(_data)
      .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', line.x())
        .attr('cy', line.y())
        .attr('r', 3.5)
    }

    return chart
  })()

  return V
})(Visualisations)
