import { Store } from 'vuex'
import { State, StateType } from './state'
import { GettersTransformer } from './getters'
import { MutationsTransformer } from './mutations'
import {
  ActionTransformer,
  ActionContext,
  RootStateHelper,
  RootGettersHelper,
} from './actions'
import { NuxtModules, ModuleTransformer } from './modules'

export interface BlankStore {
  state: {}
  getters: {}
  mutations: {}
  actions: {}
  modules: {}
  dynamic: boolean
  namespaced: boolean
  strict: boolean
}

export interface NuxtStore {
  state: State
  getters: Record<string, any>
  mutations: Record<string, any>
  actions: Record<string, any>
  modules: NuxtModules
  dynamic: boolean
  namespaced: boolean
  strict: boolean
}

export interface NuxtStoreInput<
  T extends State,
  G,
  M,
  A,
  S extends { [key: string]: Partial<NuxtStore> }
> {
  dynamic?: boolean
  strict?: boolean
  namespaced?: boolean
  state: T
  getters?: G
  mutations?: M
  actions?: A
  modules?: S
}

export type MergedStoreType<
  T extends NuxtStore,
  K = string
> = ('state' extends K ? StateType<T['state']> : {}) &
  ('getters' extends K ? GettersTransformer<T['getters']> : {}) &
  ('mutations' extends K ? MutationsTransformer<T['mutations']> : {}) &
  ('actions' extends K ? ActionTransformer<T['actions']> : {}) &
  ('modules' extends K ? ModuleTransformer<T['modules']> : {})

export const getStoreType = <T extends State, G, M, A, S extends NuxtModules>(
  store: NuxtStoreInput<T, G, M, A, S>
) => {
  return {
    actionContext: {} as ActionContext<typeof store & BlankStore>,
    rootState: {} as RootStateHelper<typeof store & BlankStore>,
    rootGetters: {} as RootGettersHelper<typeof store & BlankStore>,
    storeInstance: {} as ActionContext<typeof store & BlankStore> &
      Exclude<Store<StateType<T>>, ActionContext<any>>,
  }
}
