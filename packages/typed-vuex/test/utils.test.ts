/** @jest-environment jsdom */

import { useAccessor, getAccessorType, createMapper, Mapper } from '../src'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex, { Store } from 'vuex'

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

describe('mapper', () => {
  let store: Store<any>
  let accessor: typeof accessorType
  let mapper: Mapper<typeof accessorType>
  let Vue
  // let nuxtMapper: Mapper<typeof accessorType>

  beforeEach(() => {
    Vue = createLocalVue()
    Vue.use(Vuex)
    store = new Store(pattern)
    accessor = useAccessor(store, pattern)
    mapper = createMapper(accessor)
  })

  test('mapper works with state', () => {
    expect(mapper('email').email()).toEqual('')
    expect(mapper('submodule', ['firstName']).firstName()).toEqual('')
  })
  test('mapper works with getters', () => {
    expect(mapper('fullEmail').fullEmail()).toEqual('')
    expect(mapper('submodule', ['fullName']).fullName()).toEqual(' ')
  })
  test('mapper works with mutations', () => {
    mapper('setEmail').setEmail('example@email.com')
    expect(accessor.email).toEqual('example@email.com')
    mapper('submodule', ['setLastName']).setLastName('Smith')
    expect(accessor.submodule.fullName).toEqual(' Smith')
  })
  test('mapper works with actions', () => {
    mapper('resetEmail').resetEmail()
    expect(accessor.email).toEqual('a@a.com')
  })
  test('works within a component with injected accessor', async () => {
    const mapper = createMapper(accessorType)
    Vue.prototype.$accessor = accessor
    const Component = {
      template: `<pre>
        email: {{ JSON.stringify(email) }}
        firstName: {{ JSON.stringify(firstName) }}
        fullEmail: {{ JSON.stringify(fullEmail) }}
        fullName: {{ JSON.stringify(fullName) }}
      </pre>`,
      computed: {
        ...mapper('email'),
        ...mapper('submodule', ['firstName']),
        ...mapper('fullEmail'),
        ...mapper('submodule', ['fullName']),
      },
      methods: {
        ...mapper(['setEmail', 'resetEmail']),
        ...mapper('submodule', ['setLastName']),
      },
    }
    const wrapper = mount(Component, {
      store,
      localVue: Vue,
    })
    expect(wrapper.text()).toMatchSnapshot()
    wrapper.vm.setEmail('daniel@test.com')
    wrapper.vm.setLastName('Smith')
    await Vue.nextTick()

    expect(wrapper.html()).toMatchSnapshot()
  })
})
