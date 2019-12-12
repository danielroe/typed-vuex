export type Not<T, M> = T extends M ? never : T

export type StoreParameter<T extends () => any> = Parameters<
  T
>[1] extends undefined
  ? never
  : Parameters<T>[1] extends NonNullable<Parameters<T>[1]>
    ? Parameters<T>[1]
    : Parameters<T>[1] | undefined

export type MergedFunctionProcessor<T extends () => any, O> = Parameters<
  T
>[1] extends undefined
  ? (options?: O) => ReturnType<T>
  : Parameters<T>[1] extends NonNullable<Parameters<T>[1]>
    ? (payload: Parameters<T>[1], options?: O) => ReturnType<T>
    : (payload?: Parameters<T>[1], options?: O) => ReturnType<T>
