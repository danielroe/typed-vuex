/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Mapper } from './types/utils'

export const createMapper = <T extends Record<string, any>>(accessor: T) => {
  const mapper: Mapper<T> = (prop: any, properties?: string[]) => {
    if (!properties) {
      return Object.fromEntries(
        (Array.isArray(prop) ? prop : [prop]).map(property => [
          property,
          function(...args: any[]) {
            const value = accessor
              ? accessor[property]
              : // @ts-ignore
                this.$accessor[property]
            if (value && typeof value === 'function') return value(...args)
            return value
          },
        ])
      )
    }
    return Object.fromEntries(
      properties.map(property => [
        property,
        function(...args: any[]) {
          const value =
            // @ts-ignore
            accessor ? accessor[prop][property] : this.$accessor[prop][property]
          if (value && typeof value === 'function') return value(...args)
          return value
        },
      ])
    )
  }
  return mapper
}
