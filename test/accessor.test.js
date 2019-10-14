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
    },
  },
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
    expect(accessor.submodule.firstName).toEqual('')
    accessor.submodule.setFirstName('Nina')
    expect(accessor.submodule.firstName).toEqual('Nina')
    accessor.submodule.setLastName('Willis')
    expect(accessor.submodule.fullName).toEqual('Nina Willis')
    accessor.submodule.initialise()
    expect(accessor.submodule.fullName).toEqual('John Baker')
    accessor.submodule.setName('Jordan Lawrence')
    expect(accessor.submodule.firstName).toEqual('Jordan')
  })
})
