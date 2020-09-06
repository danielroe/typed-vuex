import type { Module } from '@nuxt/types'

/**
 * @private
 */
const nuxtTypedVuex: Module = async function() {
  /* istanbul ignore if */
  if (process.client || process.server) return

  const { join, resolve }: typeof import('path') = process.client ? /* istanbul ignore next */  {} : require('path')
  const normalize: typeof import('normalize-path') = process.client ? /* istanbul ignore next */  {} : require('normalize-path')

  if (!this.options.store) console.warn('You do not have a store defined.')
  const buildDir = this.options.buildDir || ''
  this.addPlugin({
    src: resolve(__dirname, '../template/plugin.js'),
    fileName: 'nuxt-typed-vuex.js',
    options: {
      store: normalize(join(buildDir, 'store')),
    },
  })

  this.options.build = this.options.build || {}
  this.options.build.transpile = /* istanbul ignore next */ this.options.build.transpile || []
  this.options.build.transpile.push(/typed-vuex/)
}

;(nuxtTypedVuex as any).meta = { name: 'nuxt-typed-vuex' }

export * from 'typed-vuex'

export default nuxtTypedVuex
