/* global $ */
'use strict'

;(function () {
  $('.history').each((i, el) => {
    $(el).click((e) => {
      const QUID = e.target.closest('.history').id

      if (e.target.classList.contains('share')) {
        if (!e.target.disabled) {
          $.post('/share/' + QUID)
            .done((result) => {
              e.target.innerHTML = result.success ? 'Sent' : 'Failed'
            })
            .fail(() => {
              e.target.innerHTML = 'Failed'
            })
            .always(() => {
              e.target.style.opacity = 0.5
              e.target.disabled = true
            })
        }

      } else {
        location.href = '/questionnaires/' + QUID + '/summary'

      }
    })
  })
})()
