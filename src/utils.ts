import {
  Store,
  GetterTree,
  MutationTree,
  ActionTree,
  Dispatch as VuexDispatch,
  DispatchOptions,
  CommitOptions,
} from 'vuex'

type Not<T, M> = T extends M ? never : T

type StateObject = Not<Record<string, any>, Function>
type StateFunction = Not<() => unknown | any, Record<string, any>>
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
type ModuleTransformer<T, O = string> = T extends NuxtModules
  ? { [P in keyof T]: MergedStoreType<T[P] & BlankStore, O> }
  : {}

interface BlankStore {
  state: {};
  getters: {};
  mutations: {};
  actions: {};
  modules: {};
}

interface NuxtStore {
  state: State;
  getters: Record<string, any>;
  mutations: Record<string, any>;
  actions: Record<string, any>;
  modules: NuxtModules;
}
type NuxtModules = Record<string, Partial<NuxtStore>>

interface NuxtStoreInput<
  T extends State,
  G,
  M,
  A,
  S extends { [key: string]: Partial<NuxtStore> }
> {
  namespaced?: boolean;
  state: T;
  getters?: G;
  mutations?: M;
  actions?: A;
  modules?: S;
}

type MergedStoreType<T extends NuxtStore, K = string> = ('state' extends K
  ? StateType<T['state']>
  : {}) &
  ('getters' extends K ? GettersTransformer<T['getters']> : {}) &
  ('mutations' extends K ? MutationsTransformer<T['mutations']> : {}) &
  ('actions' extends K ? ActionTransformer<T['actions']> : {}) &
  ('modules' extends K ? ModuleTransformer<T['modules']> : {})

type StoreParameter<T extends () => any> = Parameters<T>[1] extends undefined
  ? never
  : Parameters<T>[1]

interface Dispatch<T extends Record<string, () => any>> {
  <P extends keyof T>(
    action: P,
    payload: StoreParameter<T[P]>,
    options?: DispatchOptions
  ): ReturnType<T[P]>;
  <P extends keyof T>(
    action: StoreParameter<T[P]> extends never ? P : never,
    options?: DispatchOptions
  ): ReturnType<T[P]>;
}

interface Commit<T extends Record<string, () => any>> {
  <P extends keyof T>(
    mutation: P,
    payload: StoreParameter<T[P]>,
    options?: DispatchOptions
  ): ReturnType<T[P]>;
  <P extends keyof T>(
    mutation: StoreParameter<T[P]> extends never ? P : never,
    options?: CommitOptions
  ): ReturnType<T[P]>;
}

export type ActionContext<T extends Required<NuxtStore>> = {
  state: StateType<T['state']>;
  getters: { [P in keyof T['getters']]: ReturnType<T['getters'][P]> };
  commit: Commit<T['mutations']>;
  dispatch: VuexDispatch;
  rootState: any;
  rootGetters: any;
}

export type RootStateHelper<T extends Required<NuxtStore>> = StateType<
  T['state']
> &
  ModuleTransformer<T['modules'], 'state'>

export type RootGettersHelper<
  T extends Required<NuxtStore>
> = GettersTransformer<T['getters']> &
  ModuleTransformer<T['modules'], 'getters'>

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

export const getAccessorType = <
  T extends State,
  G extends GetterTree<StateType<T>, any>,
  M extends MutationTree<StateType<T>>,
  A extends ActionTree<StateType<T>, any>,
  S extends NuxtModules
>(
  store: Partial<NuxtStoreInput<T, G, M, A, S>>
) => {
  return {} as MergedStoreType<typeof store & BlankStore>
}

const getNestedState = (parent: any, namespaces: string[]): any => {
  if (!parent[namespaces[0]]) {
    return parent
  } else {
    return getNestedState(parent[namespaces[0]], namespaces.slice(1))
  }
}

const createAccessor = <T extends State, G, M, A, S extends NuxtModules>(
  store: Store<any>,
  {
    getters,
    state,
    mutations,
    actions,
    namespaced,
  }: Partial<NuxtStoreInput<T, G, M, A, S>>,
  namespace = ''
) => {
  const namespacedPath = namespace && namespaced ? `${namespace}/` : ''
  const accessor: Record<string, any> = {}
  Object.keys(getters || {}).forEach(getter => {
    Object.defineProperty(accessor, getter, {
      get: () => store.getters[`${namespacedPath}${getter}`],
    })
  })
  const evaluatedState = state
    ? typeof state === 'function'
      ? state()
      : state
    : {}
  Object.keys(evaluatedState).forEach(prop => {
    if (!Object.getOwnPropertyNames(accessor).includes(prop)) {
      const namespaces = namespace.split('/')
      const state = getNestedState(store.state, namespaces)
      Object.defineProperty(accessor, prop, {
        get: () => state[prop],
      })
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
  G extends GetterTree<StateType<T>, any>,
  M extends MutationTree<StateType<T>>,
  A extends ActionTree<StateType<T>, any>,
  S extends NuxtModules
>(
  store: Store<any>,
  input: Partial<NuxtStoreInput<T, G, M, A, S>>,
  namespace?: string,
) => {
  const accessor = createAccessor(store, input, namespace)
  Object.keys(input.modules || {}).forEach(moduleNamespace => {
    const nestedNamespace = namespace
      ? `${namespace}/${moduleNamespace}`
      : moduleNamespace
    accessor[moduleNamespace] = useAccessor(
      store,
      (input.modules as any)[moduleNamespace],
      nestedNamespace
    )
  })

  const storeType = getAccessorType(input)

  return accessor as typeof storeType
}

export const getAccessorFromStore = (pattern: any) => {
  return (store: Store<any>) =>
    useAccessor(store, pattern._modules.root._rawModule)
}

export const getterTree = <S, T extends GetterTree<StateType<S>, any>>(
  _state: S,
  tree: T
) => tree

export const mutationTree = <S, T extends MutationTree<StateType<S>>>(
  _state: S,
  tree: T
) => tree

interface ActionHandler<T extends NuxtStore> {
  (
    this: Store<StateType<T['state']>>,
    injectee: ActionContext<T>,
    payload?: any
  ): any;
}

interface ModifiedActionTree<T extends NuxtStore> {
  [key: string]: ActionHandler<T>;
}

interface NormalisedActionHandler<T extends ActionHandler<any>> {
  (this: Store<any>, ...args: Parameters<T>): ReturnType<T>;
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
