import { actionTree } from './../../..'

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
