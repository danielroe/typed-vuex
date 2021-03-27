import { join, resolve } from 'upath'

import type { Module, NuxtOptions } from '@nuxt/types'

import { name, version } from '../package.json'

/**
 * @private
 */
const nuxtTypedVuex: Module = async function() {
  const nuxtOptions = this.nuxt.options as NuxtOptions

  if (!nuxtOptions.store) console.warn('You do not have a store defined.')

  this.addPlugin({
    src: resolve(__dirname, '../template/plugin.js'),
    fileName: 'nuxt-typed-vuex.js',
    options: {
      store: join(nuxtOptions.buildDir, 'store'),
    },
  })

  nuxtOptions.build.transpile = /* istanbul ignore next */ nuxtOptions.build.transpile || []
  nuxtOptions.build.transpile.push(/typed-vuex/)
}

;(nuxtTypedVuex as any).meta = { name, version }

export default nuxtTypedVuex
