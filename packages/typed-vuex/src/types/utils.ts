export type ComputedState<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Function ? T[K] : () => T[K]
}

export interface Mapper<T extends Record<string, any>> {
  <M extends keyof T, P extends keyof T[M] = string>(
    prop: M,
    properties: P[]
  ): ComputedState<Pick<T[M], P>>
  <M extends keyof T, _P extends keyof T[M] = string>(
    prop: M | M[]
  ): ComputedState<Pick<T, M>>
}
