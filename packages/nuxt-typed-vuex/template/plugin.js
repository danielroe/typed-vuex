import { getAccessorFromStore, registerModule } from 'typed-vuex'

import { createStore } from '<%= options.store %>'

const storeAccessor = getAccessorFromStore(createStore())

export default async ({ store }, inject) => {
  const accessor = storeAccessor(store)
  inject('accessor', accessor)
  inject('accessorRegisterModule', (path, module) => {
    registerModule(path, store, accessor, module)
  })
}
