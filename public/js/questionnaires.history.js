/* global $ */
'use strict'

const xhttp = new XMLHttpRequest()

;(function () {
  $('.history').each((i, el) => {
    $(el).click((e) => {
      if (!e.target.disabled && e.target.classList.contains('share')) {
        xhttp.onreadystatechange = function () {
          if (xhttp.readyState === 4 && xhttp.status === 200
            && JSON.parse(xhttp.responseText).success === true) {
            console.log('Done')
            e.target.classList.add('disabled')
            e.target.disabled = true
            e.target.innerHTML = 'Sent'
          }
        }
        xhttp.open('GET', '/share/' + e.target.closest('.history').id)
        xhttp.send()
      } else {
        const QUID = e.target.closest('.history').id
        location.href = '/questionnaires/' + QUID + '/summary'
      }
    })
  })
})()
