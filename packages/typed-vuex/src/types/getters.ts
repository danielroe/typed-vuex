import { GetterTree } from 'vuex'
import { StateType } from './state'

export type GettersTransformer<T extends Record<string, any>> = Readonly<
  { [P in keyof T]: ReturnType<T[P]> }
>

export const getterTree = <S, T extends GetterTree<StateType<S>, any>>(
  _state: S,
  tree: T
) => tree
