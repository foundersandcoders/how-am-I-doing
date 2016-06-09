/* global d3, $ */

var Visualisations = {}

Visualisations.Base = (function () {
  'use strict'

  var WIDTH_MAX = 700 // px
  var HEIGHT_MAX = 2000 // px

  var base = {}
  var _data = null

  base.margin = { top: 40, right: 40, bottom: 80, left: 40 }

  base.width = {}
  base.height = {}

  base.width.outer = Math.min(innerWidth, WIDTH_MAX)
  base.width.inner = base.width.outer
    - base.margin.left
    - base.margin.right
  base.height.outer = Math.min(innerHeight, HEIGHT_MAX) / 2
  base.height.inner = base.height.outer
    - base.margin.top
    - base.margin.bottom

  base.formatDate = d3.time.format('%d/%m/%Y')

  base.init = function (data) {
    var that = this
    var domain = {
      x: data.map(function (_, i) {return i}),
      y: [0, d3.max(data, function (d) {return d.score})],
    }

    _data = data

    this.scale = {}
    this.scale.x = d3.scale.ordinal().domain(domain.x)
    this.scale.y = d3.scale.linear().domain(domain.y)

    this.axes = {}
    this.axes.x = d3.svg.axis()
      .scale(this.scale.x)
      .orient('bottom')
      .tickFormat(function (i) {
        return that.formatDate(_data[i].date)
      })
      .ticks(data.length)
    this.axes.y = d3.svg.axis()
      .scale(this.scale.y)
      .orient('left')
  }

  base.drawAxes = function () {
    this.chart = d3.select('.chart')
      .append('svg')
      .attr('width', this.width.outer)
      .attr('height', this.height.outer)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')

    this.chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height.inner + ')')
      .call(this.axes.x)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-0.8em')
      .attr('dy', '0.15em')
      .attr('transform', 'rotate(-65)')

    this.chart.append('g')
      .attr('class', 'y axis')
      .call(this.axes.y)
      .append('text')
      .attr('y', -21)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Total')
  }

  return base
})()
