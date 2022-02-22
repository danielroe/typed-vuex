import { join, resolve } from 'upath'

import type { Module } from '@nuxt/types'

import { name, version } from '../package.json'

/**
 * @private
 */
const nuxtTypedVuex: Module = function nuxtTypedVuex() {
  if (!this.options.store) console.warn('You do not have a store defined.')

  this.addPlugin({
    src: resolve(__dirname, '../template/plugin.js'),
    fileName: 'nuxt-typed-vuex.js',
    options: {
      store: join(this.options.buildDir, 'store'),
    },
  })

  this.options.build.transpile = /* istanbul ignore next */ this.options.build.transpile || []
  this.options.build.transpile.push(/typed-vuex/)
}

;(nuxtTypedVuex as any).meta = { name, version }

export * from './types/accessorRegisterModule'
export default nuxtTypedVuex
