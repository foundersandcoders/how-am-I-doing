/* global $ */

(function () {
  'use strict'
  $('#rcads-categories').submit(function (e) {
    var form = $(e.target)
    var checked = $('input[type=checkbox]:checked')
    var cat_ids = Array.prototype.map.call(checked, function (n) {return +n.id})

    $('<input />')
      .attr('type', 'hidden')
      .attr('name', 'categories')
      .attr('value', JSON.stringify(cat_ids))
      .appendTo(form)

    return true
  })
})()
