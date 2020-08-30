const path = require('path')

module.exports = {
  srcDir: __dirname,
  rootDir: path.resolve(__dirname, '../../'),
  buildDir: path.resolve(__dirname, '.nuxt'),
  dev: false,

  generate: {
    dir: path.resolve(__dirname, 'dist'),
  },

  buildModules: ['@nuxt/typescript-build', '../../src'],

  manifest: {
    name: 'Test Project Name',
    description: 'Test Project Description',
  },
}
