import { MutationTree, CommitOptions } from 'vuex'

import { StoreParameter, MergedFunctionProcessor } from './utilities'
import { StateType } from './state'

export type MutationsTransformer<T extends Record<string, any>> = {
  [P in keyof T]: MergedFunctionProcessor<T[P], CommitOptions>
}

export interface Commit<T extends Record<string, () => any>> {
  <P extends keyof T>(
    mutation: P,
    payload: StoreParameter<T[P]>,
    options?: CommitOptions
  ): ReturnType<T[P]>
  <P extends keyof T>(
    mutation: StoreParameter<T[P]> extends never ? P : never,
    options?: CommitOptions
  ): ReturnType<T[P]>
}

export const mutationTree = <
  S extends Record<string, any>,
  T extends MutationTree<StateType<S>>
>(
  _state: S,
  tree: T
) => tree
