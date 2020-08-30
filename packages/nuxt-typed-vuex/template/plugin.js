import { getAccessorFromStore } from 'typed-vuex'

import { createStore } from '<%= options.store %>'

const storeAccessor = getAccessorFromStore(createStore())

export default async ({ store }, inject) => {
  inject('accessor', storeAccessor(store))
}
