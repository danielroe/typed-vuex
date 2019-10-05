import {
  Store,
  GetterTree,
  MutationTree,
  ActionTree,
  DispatchOptions,
  CommitOptions,
} from 'vuex'

type Not<T, M> = T extends M ? never : T

type StateObject = Not<Record<string, any>, Function>
type StateFunction = Not<() => unknown | any, Object>
type State = StateObject | StateFunction
type StateType<T extends State> = T extends () => any ? ReturnType<T> : T

type MergedFunctionProcessor<T extends () => any, O> = Parameters<
  T
>[1] extends undefined
  ? (options?: O) => ReturnType<T>
  : (payload: Parameters<T>[1], options?: O) => ReturnType<T>

type GettersTransformer<T extends Record<string, any>> = Readonly<
  { [P in keyof T]: ReturnType<T[P]> }
>
type MutationsTransformer<T extends Record<string, any>> = {
  [P in keyof T]: MergedFunctionProcessor<T[P], CommitOptions>
}
type ActionTransformer<T extends Record<string, any>> = {
  [P in keyof T]: MergedFunctionProcessor<T[P], DispatchOptions>
}
type ModuleTransformer<T> = T extends NuxtModules
  ? { [P in keyof T]: MergedStoreType<T[P] & BlankStore> }
  : {}

interface BlankStore {
  state: () => {}
  getters: {}
  mutations: {}
  actions: {}
  modules: {}
}

interface NuxtStore {
  state: State
  getters: Record<string, any>
  mutations: Record<string, any>
  actions: Record<string, any>
  modules: NuxtModules
}
type NuxtModules = Record<string, Partial<NuxtStore> & { state: () => unknown }>

interface NuxtStoreInput<
  T extends State,
  G,
  M,
  A,
  S extends { [key: string]: Partial<NuxtStore> }
> {
  state: T
  getters?: G
  mutations?: M
  actions?: A
  modules?: S
}

type MergedStoreType<T extends NuxtStore> = StateType<T['state']> &
  GettersTransformer<T['getters']> &
  MutationsTransformer<T['mutations']> &
  ActionTransformer<T['actions']> &
  ModuleTransformer<T['modules']>

type StoreParameter<T extends () => any> = Parameters<T>[1] extends undefined
  ? never
  : Parameters<T>[1]

interface Dispatch<T extends Record<string, () => any>> {
  <P extends keyof T>(
    action: P,
    payload: StoreParameter<T[P]>,
    options?: DispatchOptions
  ): ReturnType<T[P]>
  <P extends keyof T>(
    action: StoreParameter<T[P]> extends never ? P : never,
    options?: DispatchOptions
  ): ReturnType<T[P]>
}

interface Commit<T extends Record<string, () => any>> {
  <P extends keyof T>(
    mutation: P,
    payload: StoreParameter<T[P]>,
    options?: DispatchOptions
  ): ReturnType<T[P]>
  <P extends keyof T>(
    mutation: StoreParameter<T[P]> extends never ? P : never,
    options?: CommitOptions
  ): ReturnType<T[P]>
}

export type ActionContext<T extends Required<NuxtStore>> = {
  state: StateType<T['state']>
  getters: { [P in keyof T['getters']]: ReturnType<T['getters'][P]> }
  commit: Commit<T['mutations']>
  dispatch: Dispatch<T['actions']>
  rootState: any
  rootGetters: any
}

export const getStoreType = <T extends State, G, M, A, S extends NuxtModules>(
  store: NuxtStoreInput<T, G, M, A, S>
) => {
  return {
    actionContext: {} as ActionContext<typeof store & BlankStore>,
    storeInstance: {} as ActionContext<typeof store & BlankStore> &
      Omit<Store<StateType<T>>, 'dispatch' | 'commit' | 'state' | 'getters'>,
  }
}

export const getAccessorType = <
  T extends State,
  G extends GetterTree<StateType<T>, any>,
  M extends MutationTree<StateType<T>>,
  A extends ActionTree<StateType<T>, any>,
  S extends NuxtModules
>(
  store: NuxtStoreInput<T, G, M, A, S>
) => {
  return {} as MergedStoreType<typeof store & BlankStore>
}

const createAccessor = <T extends State, G, M, A, S extends NuxtModules>(
  store: Store<StateType<T>>,
  { getters, state, mutations, actions }: NuxtStoreInput<T, G, M, A, S>,
  namespace = ''
) => {
  const namespacedPath = namespace ? `${namespace}/` : ''
  const accessor: Record<string, any> = {}
  Object.keys(getters || {}).forEach(getter => {
    Object.defineProperty(accessor, getter, {
      get: () => store.getters[`${namespacedPath}${getter}`],
    })
  })
  Object.keys(
    state ? (typeof state === 'function' ? state() : state) : {}
  ).forEach(prop => {
    if (!Object.getOwnPropertyNames(accessor).includes(prop)) {
      if (namespace) {
        Object.defineProperty(accessor, prop, {
          get: () => (store.state as any)[namespace][prop],
        })
      } else {
        Object.defineProperty(accessor, prop, {
          get: () => (store.state as any)[prop],
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
  T extends State,
  G extends GetterTree<StateType<T>, StateType<T>>,
  M extends MutationTree<StateType<T>>,
  A extends ActionTree<StateType<T>, StateType<T>>,
  S extends NuxtModules
>(
  store: Store<StateType<T>>,
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
