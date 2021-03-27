import { actionTree } from '../../../../typed-vuex/src'

export const state = () => ({
  n: '',
})

export const actions = actionTree(
  { state },
  {
    testNuxtTyping() {
      this.app.$accessor.initialiseStore()
    },
  }
)
