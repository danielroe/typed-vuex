import {
  DispatchOptions,
  Dispatch,
  GetterTree,
  MutationTree,
  Store,
} from 'vuex'

import { NuxtStore, NuxtStoreInput } from './store'
import { StateType, State } from './state'
import { GettersTransformer } from './getters'
import { Commit } from './mutations'
import { ModuleTransformer } from './modules'
import { MergedFunctionProcessor } from './utilities'

// interface Dispatch<Actions extends Record<string, () => any>> {
//   <A extends keyof Actions>(
//     action: A,
//     payload: StoreParameter<Actions[A]>,
//     options?: DispatchOptions
//   ): ReturnType<Actions[A]>
//   <A extends keyof Actions>(
//     action: StoreParameter<Actions[A]> extends never ? A : never,
//     options?: DispatchOptions
//   ): ReturnType<Actions[A]>
// }

export type RootStateHelper<T extends Required<NuxtStore>> = StateType<
  T['state']
> &
  ModuleTransformer<T['modules'], 'state'>

export type RootGettersHelper<
  T extends Required<NuxtStore>
> = GettersTransformer<T['getters']> &
  ModuleTransformer<T['modules'], 'getters'>

export type ActionContext<T extends Required<NuxtStore>> = {
  state: StateType<T['state']>
  getters: { [P in keyof T['getters']]: ReturnType<T['getters'][P]> }
  commit: Commit<T['mutations']>
  dispatch: Dispatch
  rootState: any
  rootGetters: any
}

export type ActionTransformer<T extends Record<string, any>> = {
  [P in keyof T]: MergedFunctionProcessor<T[P], DispatchOptions>
}

interface ActionHandler<T extends NuxtStore> {
  (
    this: Store<StateType<T['state']>>,
    injectee: ActionContext<T>,
    payload?: any
  ): any
}

interface ModifiedActionTree<T extends NuxtStore> {
  [key: string]: ActionHandler<T>
}

export interface NormalisedActionHandler<T extends ActionHandler<any>> {
  (this: Store<any>, ...args: Parameters<T>): ReturnType<T>
}

type NormalisedActionTree<T extends ModifiedActionTree<any>> = {
  [P in keyof T]: NormalisedActionHandler<T[P]>
}

export const actionTree = <
  S extends State,
  G extends GetterTree<StateType<S>, any>,
  M extends MutationTree<StateType<S>>,
  T extends ModifiedActionTree<Required<NuxtStoreInput<S, G, M, {}, {}>>>
>(
  _store: NuxtStoreInput<S, G, M, {}, {}>,
  tree: T
) => tree as NormalisedActionTree<T>
