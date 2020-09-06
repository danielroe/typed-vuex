import type { Module } from '@nuxt/types'

/**
 * @private
 */
const nuxtTypedVuex: Module = async function() {
  if (process.client || process.server) return

  const { join, resolve }: typeof import('path') = process.client ? {} : require('path')
  const normalize: typeof import('normalize-path') = process.client ? {} : require('normalize-path')
  const consola: typeof import('consola').default = process.client ? {} : require('consola')
  const logger = consola.withTag('nuxt-typed-vuex')

  if (!this.options.store) logger.warn('You do not have a store defined.')
  const buildDir = this.options.buildDir || ''
  this.addPlugin({
    src: resolve(__dirname, '../template/plugin.js'),
    fileName: 'nuxt-typed-vuex.js',
    options: {
      store: normalize(join(buildDir, 'store')),
    },
  })

  this.options.build.transpile = /* istanbul ignore next */ this.options.build.transpile || []
  this.options.build.transpile.push(/typed-vuex/)
}

;(nuxtTypedVuex as any).meta = { name: 'nuxt-typed-vuex' }

export * from 'typed-vuex'

export default nuxtTypedVuex
