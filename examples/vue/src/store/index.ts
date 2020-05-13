import Vue from 'vue'
import Vuex from 'vuex'
import { useAccessor, mutationTree, actionTree } from 'typed-vuex'

import * as submodule from './submodule'

export const state = () => ({
  email: '',
})

type RootState = ReturnType<typeof state>

export const getters = {
  email: (state: RootState) => state.email,
  fullEmail: (state: RootState) => state.email,
}

export const mutations = mutationTree(state, {
  setEmail(state, newValue: string) {
    state.email = newValue
  },

  initialiseStore() {
    // console.log('initialised')
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async resetEmail({ commit }) {
      commit('setEmail', 'a@a.com')
    },
  }
)

export const storePattern = {
  state,
  mutations,
  actions,
  modules: { submodule },
}

Vue.use(Vuex)

const store = new Vuex.Store(storePattern)
export const accessor = useAccessor(store, storePattern)

Vue.prototype.$accessor = accessor

export default store
