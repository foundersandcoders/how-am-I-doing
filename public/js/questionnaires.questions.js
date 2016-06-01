/* global $ */

(function () {
  'use strict'
  function scrollToId (qID) {
    var target = document.getElementById(qID).offsetTop
    $('html, body').animate({ scrollTop: target }, 1000)
  }

  function scrollNext (currentNode) {
    var nextNodeId = +currentNode + 1
    scrollToId('prev-' + nextNodeId)
  }

  function scrollPrev (currentNode) {
    var nextNodeId = +currentNode - 1
    scrollToId('prev-' + nextNodeId)
  }

  $('[id^=prev-]').each(function (i, element) {
    $(element).click(function (e) {
      e.preventDefault()
      var current = e.target.closest('.arrow').id.slice(5)
      scrollPrev(current)
    })
  })

  $('[id^=next-]').each(function (i, element) {
    $(element).click(function (e) {
      e.preventDefault()
      var current = e.target.closest('.arrow').id.slice(5)
      scrollNext(current)
    })
  })
})()
