import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueSession from 'vue-session'
import DisableAutocomplete from 'vue-disable-autocomplete';


Vue.use(DisableAutocomplete);
Vue.use(VueSession, { persist: true })
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
