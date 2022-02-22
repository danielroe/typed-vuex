import { NuxtStore, MergedStoreType, BlankStore } from './store'

export type NuxtModules = Record<string, Partial<NuxtStore & {dynamic: boolean}>>

type TransformedModule<T extends NuxtModules, P extends keyof T, O = string> = MergedStoreType<T[P] & BlankStore, O>

export type ModuleTransformer<T, O = string> = T extends NuxtModules
  ? { [P in keyof T]: T[P]['dynamic'] extends boolean ? undefined | TransformedModule<T, P, O> : TransformedModule<T, P, O> }
  : {}
