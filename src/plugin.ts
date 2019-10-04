import { InjectKey } from 'vue/types/options'
import { Context } from '@nuxt/types'

const { createStore } = require('<%= options.buildDir %>/store')

const { getAccessorFromStore } = require('<%= options.libDir %>/utils')

type Inject = (name: InjectKey, property: unknown) => void
const storeAccessor = getAccessorFromStore(createStore())

export default async ({ store }: Context, inject: Inject) => {
  inject('accessor', storeAccessor(store))
}
