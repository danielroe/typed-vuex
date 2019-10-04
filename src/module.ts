import path from 'path'
import { Configuration } from '@nuxt/types'

export default async function nuxtTypedVuex(this: {
  options: Configuration;
  addPlugin: (options: any) => void;
}) {
  if (!this.options.store) {
    console.warn('You do not have a Nuxt store defined.')
  }
  const { buildDir } = this.options
  const libDir = __dirname
  this.addPlugin({
    src: path.resolve(__dirname, './plugin.js'),
    fileName: 'nuxt-typed-vuex.js',
    options: {
      libDir,
      buildDir,
    },
  })
}

// eslint-disable-next-line
export const meta = require('../package.json')

export * from './utils'
