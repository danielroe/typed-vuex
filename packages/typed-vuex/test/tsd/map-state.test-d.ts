import Vue from 'vue'
import { getAccessorType, createMapper } from 'typed-vuex'
import { expectType } from 'tsd'

import { getters, state, actions, mutations } from '../fixture'

import * as submodule from '../fixture/submodule'
import { CommitOptions, DispatchOptions } from 'vuex/types/index'

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

const accessor = getAccessorType(pattern)
const mapper = createMapper(accessor)

Vue.extend({
  computed: {
    ...mapper(['email']),
    ...mapper('fullEmail'),
    ...mapper('submodule', ['fullName']),
  },
  methods: {
    ...mapper('submodule', ['setFirstName', 'setName']),
    ...mapper(['resetEmail', 'initialiseStore']),
    test(): void {
      // actions
      expectType<(options?: DispatchOptions | undefined) => Promise<void>>(
        this.resetEmail
      )
      expectType<
        (payload: string, options?: DispatchOptions | undefined) => void
      >(this.setName)
      // getter
      expectType<string>(this.fullEmail)
      expectType<string>(this.fullName)
      // state
      expectType<string>(this.email)
      // mutations
      expectType<
        (payload: string, options?: CommitOptions | undefined) => void
      >(this.setFirstName)
      expectType<(options?: CommitOptions | undefined) => void>(
        this.initialiseStore
      )
    },
  },
})
