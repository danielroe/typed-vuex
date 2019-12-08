import { NuxtStore, MergedStoreType, BlankStore } from './store'

export type NuxtModules = Record<string, Partial<NuxtStore>>

export type ModuleTransformer<T, O = string> = T extends NuxtModules
  ? { [P in keyof T]: MergedStoreType<T[P] & BlankStore, O> }
  : {}
