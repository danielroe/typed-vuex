import { Store, GetterTree, MutationTree, ActionTree } from 'vuex'

type MergedFunctionProcessor<T extends () => any> = Parameters<
  T
>[1] extends undefined
  ? () => ReturnType<T>
  : (payload: Parameters<T>[1]) => ReturnType<T>

type GettersTransformer<T extends Record<string, any>> = Readonly<
  { [P in keyof T]: ReturnType<T[P]> }
>
type MutationsTransformer<T extends Record<string, any>> = {
  [P in keyof T]: MergedFunctionProcessor<T[P]>
}
type ActionTransformer<T extends Record<string, any>> = {
  [P in keyof T]: MergedFunctionProcessor<T[P]>
}
type ModuleTransformer<T> = T extends NuxtModules
  ? { [P in keyof T]: MergedStoreType<T[P]> }
  : {}

type BlankStore = {
  getters: {}
  mutations: {}
  actions: {}
  modules: {}
}

type NuxtStore = {
  state: () => unknown
  getters: Record<string, any>
  mutations: Record<string, any>
  actions: Record<string, any>
  modules: NuxtModules
}
type NuxtModules = Record<string, NuxtStore>

type NuxtStoreInput<
  T extends () => any,
  G,
  M,
  A,
  S extends { [key: string]: NuxtStore }
> = {
  state: T
  getters?: G
  mutations?: M
  actions?: A
  modules?: S
}

type MergedStoreType<T extends NuxtStore> = ReturnType<T['state']> &
  GettersTransformer<T['getters']> &
  MutationsTransformer<T['mutations']> &
  ActionTransformer<T['actions']> &
  ModuleTransformer<T['modules']>

type StoreParameter<T extends () => any> = Parameters<T>[1] extends undefined
  ? []
  : [Parameters<T>[1]]

type FunctionProcessor<M extends Record<string, () => any>> = <
  P extends keyof M
>(
  mutation: P,
  ...args: StoreParameter<M[P]>
) => ReturnType<M[P]>

export type StoreType<T extends Required<NuxtStore>> = {
  state: ReturnType<T['state']> &
    { [P in keyof T['modules']]: ReturnType<T['modules'][P]['state']> }
  getters: { [P in keyof T['getters']]: ReturnType<T['getters'][P]> }
  commit: FunctionProcessor<T['mutations']>
  dispatch: FunctionProcessor<T['actions']>
}

export const getStoreType = <
  T extends () => any,
  G,
  M,
  A,
  S extends NuxtModules
>(
    store: NuxtStoreInput<T, G, M, A, S>
  ) => {
  return {} as StoreType<typeof store & BlankStore> &
    Omit<Store<ReturnType<T>>, 'getters' | 'dispatch' | 'commit'>
}

export const getAccessorType = <
  T extends () => any,
  G extends GetterTree<ReturnType<T>, ReturnType<T>>,
  M extends MutationTree<ReturnType<T>>,
  A extends ActionTree<ReturnType<T>, ReturnType<T>>,
  S extends NuxtModules
>(
    store: NuxtStoreInput<T, G, M, A, S>
  ) => {
  return {} as MergedStoreType<typeof store & BlankStore>
}

const createAccessor = <T extends () => any, G, M, A, S extends NuxtModules>(
  store: Store<ReturnType<T>>,
  { getters, state, mutations, actions }: NuxtStoreInput<T, G, M, A, S>,
  namespace = ''
) => {
  const namespacedPath = namespace ? `${namespace}/` : ''
  const accessor: Record<string, any> = {}
  Object.keys(getters || {}).forEach(getter => {
    Object.defineProperty(accessor, getter, {
      get: () => store.getters[`${namespacedPath}${getter}`]
    })
  })
  Object.keys(state ? state() : {}).forEach(prop => {
    if (!Object.getOwnPropertyNames(accessor).includes(prop)) {
      if (namespace) {
        Object.defineProperty(accessor, prop, {
          get: () => (store.state as any)[namespace][prop]
        })
      } else {
        Object.defineProperty(accessor, prop, {
          get: () => (store.state as any)[prop]
        })
      }
    }
  })
  Object.keys(mutations || {}).forEach(mutation => {
    accessor[mutation] = (mutationPayload: any) =>
      store.commit(`${namespacedPath}${mutation}`, mutationPayload)
  })
  Object.keys(actions || {}).forEach(action => {
    accessor[action] = (actionPayload: any) =>
      store.dispatch(`${namespacedPath}${action}`, actionPayload)
  })
  return accessor
}

export const useAccessor = <
  T extends () => any,
  G extends GetterTree<ReturnType<T>, ReturnType<T>>,
  M extends MutationTree<ReturnType<T>>,
  A extends ActionTree<ReturnType<T>, ReturnType<T>>,
  S extends NuxtModules
>(
    store: Store<ReturnType<T>>,
    input: Required<NuxtStoreInput<T, G, M, A, S>>
  ) => {
  const accessor = createAccessor(store, input)
  Object.keys(input.modules || {}).forEach(namespace => {
    accessor[namespace] = createAccessor(
      store,
      (input.modules as any)[namespace],
      namespace
    )
  })

  const storeType = getAccessorType(input)

  return accessor as typeof storeType
}

export const getAccessorFromStore = (pattern: any) => {
  return (store: Store<any>) =>
    useAccessor(store, pattern._modules.root._rawModule)
}
