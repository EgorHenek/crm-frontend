import Vue from 'vue'
import dateFormat from 'date-fns/format'
import dateLocale from 'date-fns/locale/ru'

Vue.filter('dateFormat', function (value, format) {
  if (!value) return ''
  return dateFormat(value, format, {
    locale: dateLocale
  })
})
