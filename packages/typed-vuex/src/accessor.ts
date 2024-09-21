import { ActionTree, GetterTree, Module, MutationTree, Store } from 'vuex'
import { BlankStore, MergedStoreType, NuxtStoreInput } from './types/store'
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
  return (undefined as any) as MergedStoreType<typeof store & BlankStore>
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
    ? state instanceof Function
      ? state()
      : state
    : {}
  Object.keys(evaluatedState).forEach(prop => {
    if (!Object.getOwnPropertyNames(accessor).includes(prop)) {
      const namespaces = namespace.split('/')
      Object.defineProperty(accessor, prop, {
        get: () => getNestedState(store.state, namespaces)[prop],
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

const processModuleByPath = (
  accessor: MergedStoreType<Partial<NuxtStoreInput<any, any, any, any, any>> & BlankStore, string>,
  path: string | string[]
): {target: Record<string, any>, key: string} => {
  const paths = typeof path === 'string' ? [path] : path

  let target = accessor
  let key: string | undefined
  paths.forEach((part, index) => {
    if (index === paths.length - 1) {
      if (!target) throw new Error(`Could not find parent module for ${paths[index - 1] || paths[index]}`)
      key = part
    } else {
      target = target[part]
    }
  })

  return {
    target,
    //Key can not be undefined
    key: key as string,
  }
}

export const registerModule = (
  path: string | [string, ...string[]],
  store: Store<any>,
  accessor: MergedStoreType<Partial<NuxtStoreInput<any, any, any, any, any>> & BlankStore, string>,
  module: Module<any, any>
) => {
  module.namespaced = true

  if (module.modules) module.modules = Object.entries(module.modules).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: {
      ...value,
      namespaced: true,
    }
  }), {}) as typeof module['modules']

  let preserveState = false
  if (typeof path === 'string') preserveState = !!store.state[path]
  else {
    let target = store.state
    for (const key of path) {
      if (!target) break
      target = target[key]
    }
    preserveState = !!target
  }

  const paths = typeof path === 'string' ? [path] : path
  const processedModule = processModuleByPath(accessor, paths)
  store.registerModule(path as string, module as Module<any, any>, {
    preserveState,
  })
  processedModule.target[processedModule.key] = useAccessor(store, module, paths.join('/'))
}

export const unregisterModule = (
  path: string | [string, ...string[]],
  store: Store<any>,
  accessor: MergedStoreType<Partial<NuxtStoreInput<any, any, any, any, any>> & BlankStore, string>
) => {
  const processedModule = processModuleByPath(accessor, path)
  store.unregisterModule(path as string)
  delete processedModule.target[processedModule.key]
}
