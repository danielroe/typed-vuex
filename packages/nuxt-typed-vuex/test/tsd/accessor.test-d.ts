import { DispatchOptions, CommitOptions } from 'vuex'
import { expectType, expectError } from 'tsd'

import { getAccessorType } from '../../lib/utils'
import { getters, state, actions, mutations } from '../fixture/store'

import * as submodule from '../fixture/store/submodule'

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

expectType<string>(accessorType.fullEmail)
interface CommitFunction {
  (payload: string, options?: CommitOptions): void
}
expectType<CommitFunction>(accessorType.setEmail)

interface ActionFunction {
  (options?: DispatchOptions): Promise<void>
}
interface ActionFunctionWithOptionalPayload {
  (payload?: string | undefined, options?: DispatchOptions): Promise<void>
}
expectType<ActionFunction>(accessorType.resetEmail)
expectType<ActionFunctionWithOptionalPayload>(
  accessorType.resetEmailWithOptionalPayload
)

expectType<string>(submoduleAccessorType.firstName)
expectType<void>(submoduleAccessorType.initialise())
expectError(submoduleAccessorType.initialise('argument'))
