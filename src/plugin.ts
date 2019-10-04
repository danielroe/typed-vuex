import { InjectKey } from 'vue/types/options'
import { Context } from '@nuxt/types'

// eslint-disable-next-line
const { createStore } = require('<%= options.buildDir %>/store')
// eslint-disable-next-line
const { getAccessorFromStore } = require('<%= options.libDir %>/utils')

type Inject = (name: InjectKey, property: unknown) => void
const storeAccessor = getAccessorFromStore(createStore())

export default async ({ store }: Context, inject: Inject) => {
  inject('accessor', storeAccessor(store))
}
