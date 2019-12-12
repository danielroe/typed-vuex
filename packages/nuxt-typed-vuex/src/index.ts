import path from 'path'
import { Configuration } from '@nuxt/types'
import normalize from 'normalize-path'

export default async function nuxtTypedVuex(this: {
  options: Configuration
  addPlugin: (options: any) => void
}) {
  if (!this.options.store) {
    console.warn('You do not have a Nuxt store defined.')
  }
  const buildDir = this.options.buildDir || ''
  this.addPlugin({
    src: path.resolve(__dirname, './plugin.js'),
    fileName: 'nuxt-typed-vuex.js',
    options: {
      store: normalize(path.join(buildDir, 'store')),
    },
  })
}

// eslint-disable-next-line
export const meta = require('../package.json')

export * from 'typed-vuex'
