import { useAccessor, getAccessorType, getAccessorFromStore, registerModule, unregisterModule } from '../src'
import Vuex, { Store } from 'vuex'
import Vue from 'vue'

import { getters, state, actions, mutations } from './fixture'
import * as submodule from './fixture/submodule'

const pattern = {
  getters,
  state,
  actions,
  mutations,
  modules: {
    submodule: {
      ...submodule,
      namespaced: true,
      modules: {
        nestedSubmodule: {
          ...submodule,
          namespaced: true,
        },
      },
    },
  },
}

const accessorType = getAccessorType(pattern)
const submoduleAccessorType = getAccessorType(submodule)

const submoduleBehaviour = (accessor: typeof submoduleAccessorType) => {
  expect(accessor.firstName).toEqual('')
  accessor.setFirstName('Nina')
  expect(accessor.firstName).toEqual('Nina')
  accessor.setLastName('Willis')
  expect(accessor.fullName).toEqual('Nina Willis')

  accessor.initialise()
  expect(accessor.fullName).toEqual('John Baker')
  accessor.setName('Jordan Lawrence')
  expect(accessor.lastName).toEqual('Lawrence')
  accessor.setName('George')
  expect(accessor.firstName).toEqual('George')
}

describe('accessor', () => {
  let store: Store<any>
  let accessor: typeof accessorType

  beforeEach(() => {
    Vue.use(Vuex)
    store = new Store(pattern)
    accessor = useAccessor(store, pattern)
  })
  test('store exists', async () => {
    expect(pattern).toMatchSnapshot()
  })
  test('accessor object exists', async () => {
    expect(accessor).toMatchSnapshot()
  })
  test('accessor can be generated from store object', async () => {
    const accessorFromStore = getAccessorFromStore(store)(store)
    expect(accessorFromStore).toMatchSnapshot()
  })
  test('accessor works with state object', async () => {
    const stateAccessor = useAccessor(store, {
      state: {
        email: 'this does not matter',
      },
      mutations: {
        setEmail(state, newValue: string) {
          ;(state as any).email = newValue
        },
      },
    })
    expect(stateAccessor.email).toMatchSnapshot()
    stateAccessor.setEmail('test1@email.com')
    expect(stateAccessor.email).toMatchSnapshot()
  })
  test('accessor state, getter, mutation and actions work', async () => {
    expect(accessor.fullEmail).toEqual('')
    expect(accessor.initialiseStore()).toBeUndefined()
    accessor.resetEmailWithOptionalPayload('j@j.com')
    expect(accessor.fullEmail).toEqual('j@j.com')
    accessor.resetEmailWithOptionalPayload()
    expect(accessor.fullEmail).toEqual('a@a.com')

    accessor.setEmail('john@j.com')
    expect(accessor.email).toEqual('john@j.com')
    expect(accessor.fullEmail).toEqual('john@j.com')

    accessor.resetEmail()
    expect(accessor.fullEmail).toEqual('a@a.com')
  })
  test('accessor submodule state, getter, mutation and actions work', async () => {
    submoduleBehaviour(accessor.submodule)
  })
  test('namespaced modules work', async () => {
    const nonNamespacedPattern = {
      getters,
      state,
      actions,
      mutations,
      modules: {
        submodule: {
          ...submodule,
          namespaced: false,
        },
      },
    }
    const nonNamespacedStore = new Store(nonNamespacedPattern)
    const nonNamespacedAccessor = useAccessor(
      nonNamespacedStore,
      nonNamespacedPattern
    )
    submoduleBehaviour(nonNamespacedAccessor.submodule)
  })
  test('nested modules work', async () => {
    submoduleBehaviour(accessor.submodule.nestedSubmodule)
  })
  test('namespaced dynamic modules work', async () => {
    store.registerModule('dynamicSubmodule', { ...submodule, namespaced: true })
    const dynamicAccessor = useAccessor(store, {
      modules: {dynamicSubmodule: { ...submodule, namespaced: true }},
    })

    submoduleBehaviour(dynamicAccessor.dynamicSubmodule)

    store.unregisterModule('dynamicSubmodule')
  })
  test('dynamic module helper function works', async () => {
    store.registerModule('dynamicSubmodule', submodule)
    const dynamicAccessor = useAccessor(store, submodule, 'dynamicSubmodule')

    submoduleBehaviour(dynamicAccessor)
    store.unregisterModule('dynamicSubmodule')
  })
  test('dynamic module global registration works', async () => {
    registerModule('dynamicSubmodule', store, accessor, submodule)
    expect(store.state.dynamicSubmodule.firstName).toBeDefined()
    expect(store.state.dynamicSubmodule.nestedSubmodule).toBeUndefined()
    submoduleBehaviour(accessor.dynamicSubmodule)
    expect(accessor.dynamicSubmodule.nestedSubmodule).toBeUndefined()

    registerModule(['dynamicSubmodule', 'nestedSubmodule'], store, accessor, submodule)
    expect(store.state.dynamicSubmodule.nestedSubmodule.firstName).toBeDefined()
    submoduleBehaviour(accessor.dynamicSubmodule.nestedSubmodule)

    unregisterModule('dynamicSubmodule', store, accessor)
    expect(store.state.dynamicSubmodule).toBeUndefined()
    expect(accessor.dynamicSubmodule).toBeUndefined()

    registerModule('dynamicSubmodule', store, accessor, submodule)
    expect(store.state.dynamicSubmodule.nestedSubmodule).toBeUndefined()
    expect(accessor.dynamicSubmodule.nestedSubmodule).toBeUndefined()

    registerModule(['dynamicSubmodule', 'nestedSubmodule'], store, accessor, submodule)
    expect(store.state.dynamicSubmodule.nestedSubmodule.firstName).toBeDefined()
    expect(accessor.dynamicSubmodule.nestedSubmodule.firstName).toBeDefined()

    unregisterModule(['dynamicSubmodule', 'nestedSubmodule'], store, accessor)
    expect(store.state.dynamicSubmodule).toBeDefined()
    expect(accessor.dynamicSubmodule).toBeDefined()
    expect(store.state.dynamicSubmodule.nestedSubmodule).toBeUndefined()
    expect(accessor.dynamicSubmodule.nestedSubmodule).toBeUndefined()

    unregisterModule('dynamicSubmodule', store, accessor)
  })
})
