module.exports = {
  buildModules: ['@nuxt/typescript-build', '../../src'],
  build: {
    babel: {
      presets(_ctx, [_preset, options]) {
        options.corejs = 3
      },
    },
  },
  typescript: {
    typeCheck: false,
  },
}
