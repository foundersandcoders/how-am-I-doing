/* global $ */
'use strict'

;(function () {
  $('.history').each((i, el) => {
    $(el).click((e) => {
      const QUID = e.target.closest('.history').id
      location.href = '/questionnaires/' + QUID + '/summary'
    })
  })
})()
