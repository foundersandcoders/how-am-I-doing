/* global $ */
'use strict'

;(function () {
  function scrollToId (qID) {
    const target = document.getElementById(qID).offsetTop
    $('html, body').animate({ scrollTop: target }, 1000)
  }

  function scrollNext (currentNode) {
    const nextNodeId = +currentNode + 1
    scrollToId('prev-' + nextNodeId)
  }

  function scrollPrev (currentNode) {
    const nextNodeId = +currentNode - 1
    scrollToId('prev-' + nextNodeId)
  }

  $('[id^=prev-]').each(function (i, element) {
    $(element).click(function (e) {
      e.preventDefault()
      const current = e.target.closest('.arrow').id.slice(5)
      scrollPrev(current)
    })
  })

  $('[id^=next-]').each(function (i, element) {
    $(element).click(function (e) {
      e.preventDefault()
      const current = e.target.closest('.arrow').id.slice(5)
      scrollNext(current)
    })
  })
})()
