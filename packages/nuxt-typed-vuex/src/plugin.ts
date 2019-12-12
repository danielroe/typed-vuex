import { InjectKey } from 'vue/types/options'
import { Context } from '@nuxt/types'

// eslint-disable-next-line
const { createStore } = require('<%= options.store %>')
// eslint-disable-next-line
const { getAccessorFromStore } = require('typed-vuex')

type Inject = (name: InjectKey, property: unknown) => void
const storeAccessor = getAccessorFromStore(createStore())

export default async ({ store }: Context, inject: Inject) => {
  inject('accessor', storeAccessor(store))
}
