/* global $ */
'use strict'

;(function () {
  $('#rcads-categories').submit(function (e) {
    const form = $(e.target)
    const checked = $('input[type=checkbox]:checked')
    const cat_ids = Array.prototype.map.call(checked, function (n) {return +n.id})

    $('<input />')
      .attr('type', 'hidden')
      .attr('name', 'categories')
      .attr('value', JSON.stringify(cat_ids))
      .appendTo(form)

    $('input[name=category]').remove()

    return true
  })
})()
