import { Store, GetterTree, MutationTree, ActionTree } from 'vuex'
import { NuxtStoreInput, MergedStoreType, BlankStore } from './types/store'
import { State, StateType } from './types/state'
import { NuxtModules } from './types/modules'

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
  namespace?: string
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
