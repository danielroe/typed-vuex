const { useAccessor } = require('../')
const vuex = require('vuex')
const Vue = require('vue')
const {
  getters,
  state,
  actions,
  mutations,
  modules,
} = require('./fixture/store')

const submodule = require('./fixture/store/submodule')

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
        }
      }
    },
  },
}

const submoduleBehaviour = (submodule) => {
    expect(submodule.firstName).toEqual('')
    submodule.setFirstName('Nina')
    expect(submodule.firstName).toEqual('Nina')
    submodule.setLastName('Willis')
    expect(submodule.fullName).toEqual('Nina Willis')
    submodule.initialise()
    expect(submodule.fullName).toEqual('John Baker')
    submodule.setName('Jordan Lawrence')
    expect(submodule.firstName).toEqual('Jordan')
}

describe.only('accessor', () => {
  let store
  let accessor
  beforeEach(() => {
    Vue.use(vuex)
    store = new vuex.Store(pattern)
    accessor = useAccessor(store, pattern)
  })
  test('store exists', async () => {
    expect(pattern).toMatchSnapshot()
  })
  test('accessor object exists', async () => {
    expect(accessor).toMatchSnapshot()
  })
  test('accessor state, getter, mutation and actions work', async () => {
    expect(accessor.fullEmail).toEqual('')
    accessor.setEmail('john@j.com')
    expect(accessor.email).toEqual('john@j.com')
    expect(accessor.fullEmail).toEqual('john@j.com')
    accessor.resetEmail()
    expect(accessor.fullEmail).toEqual('a@a.com')
  })
  test('accessor submodule state, getter, mutation and actions work', async () => {
    submoduleBehaviour(accessor.submodule)
  })
  test('nested modules work', async () => {
    submoduleBehaviour(accessor.submodule.nestedSubmodule)
  })
  test('dynamic modules work', async () => {
    store.registerModule('submodule', submodule)
    const dynamicAccessor = useAccessor(store, { modules: { submodule } })

    submoduleBehaviour(dynamicAccessor.submodule)
  })
  test('dynamic module helper function works', async () => {
    store.registerModule('submodule', submodule)
    const dynamicAccessor = useAccessor(store, submodule, 'submodule')

    submoduleBehaviour(dynamicAccessor)
  })
})
