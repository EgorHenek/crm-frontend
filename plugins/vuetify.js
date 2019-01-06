import '@fortawesome/fontawesome-free/css/all.css';
/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import Vuetify from 'vuetify';
import ru from 'vuetify/es5/locale/ru';

Vue.use(Vuetify, {
  iconfont: 'fa',
  lang: {
    locales: { ru },
    current: 'ru',
  },
});
