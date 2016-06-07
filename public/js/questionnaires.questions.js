/* global $ */

(function () {
  'use strict'
  var padding = $('header').height()
  $('html, body').scrollTop(padding)

  function scrollToId (qID) {
    var target = document.getElementById(qID)
    if (!target)
      target = document.querySelector('input[type=submit]')

    $('html, body').animate({ scrollTop: target.offsetTop - padding }, 1000)
  }

  function eachHandler (direction) {
    return function (i, element) {
      $(element).click(function (e) {
        e.preventDefault()
        var current = $(e.target).closest('.arrow').attr('id').slice(5)
        var nextNodeId = +current + direction * 1
        if (nextNodeId > -1)
          scrollToId('prev-' + nextNodeId)
      })
    }
  }

  $('[id^=prev-]').each(eachHandler(-1))
  $('[id^=next-]').each(eachHandler(+1))
})()
