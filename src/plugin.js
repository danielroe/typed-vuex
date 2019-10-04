import { createStore } from '<%= options.buildDir %>/store'

import {
  useAccessorFromPattern,
  getStorePattern
} from '<%= options.libDir %>/utils'

const accessorPattern = getStorePattern(createStore())

export default async ({ store }, inject) => {
  inject('accessor', useAccessorFromPattern(store, accessorPattern))
}
