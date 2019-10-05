import { Plugin, ActionContext, Store } from 'vuex'
import { getStoreType, getAccessorType } from './../../../src/utils'

import * as submodule from './submodule'

export const state = () => ({
  email: '',
})

type AnotherState = {
  untypedSubmodule: {
    property: 2;
  };
}

type RootState = ReturnType<typeof state>

export const getters = {
  email: (state: RootState) => state.email,
}

export const mutations = {
  setEmail(state: RootState, newValue: string) {
    state.email = newValue
  },

  initialiseStore() {
    console.log('initialised')
  },
}

export const actions = {
  async resetEmail(
    this: Store<RootState>,
    { commit }: ActionContext<RootState, AnotherState>
  ) {
    commit('setEmail', 'james@giantpeach.com')
  },
}

export const plugins: Plugin<RootState>[] = []

export const storeType = getStoreType({
  actions,
  getters,
  mutations,
  state,
})

export const accessorType = getAccessorType({
  actions,
  getters,
  mutations,
  state,
  modules: {
    submodule,
  },
})
