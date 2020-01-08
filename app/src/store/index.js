import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accountId: 77
  },
  mutations: {
    setAccountId(state, id) {
      state.accountId = id;
    }
  },
  actions: {
  },
  modules: {
  }
})
