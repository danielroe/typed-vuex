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

  build: {
    babel: {
      presets(ctx, [preset, options]) {
        options.corejs = 3
      },
    },
  },

  manifest: {
    name: 'Test Project Name',
    description: 'Test Project Description',
  },
}
