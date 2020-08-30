import path from 'path'

import normalize from 'normalize-path'
import type { Module } from '@nuxt/types'

const nuxtTypedVuex: Module = async function() {
  if (!this.options.store) {
    console.warn('You do not have a Nuxt store defined.')
  }
  const buildDir = this.options.buildDir || ''
  this.addPlugin({
    src: path.resolve(__dirname, '../template/plugin.js'),
    fileName: 'nuxt-typed-vuex.js',
    options: {
      store: normalize(path.join(buildDir, 'store')),
    },
  })

  this.options.build.transpile = /* istanbul ignore next */ this.options.build.transpile || []
  this.options.build.transpile.push(/typed-vuex/)
}

;(nuxtTypedVuex as any).meta = { name: 'nuxt-typed-vuex' }

export * from 'typed-vuex'

export default nuxtTypedVuex
