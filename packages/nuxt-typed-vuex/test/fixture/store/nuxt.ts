import { actionTree } from '../../../src'

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
