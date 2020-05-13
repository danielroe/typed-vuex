module.exports = {
  title: '🏦 Nuxt Typed Vuex',
  description: 'Vanilla, strongly-typed store accessor',
  evergreen: true,
  dest: 'dist',
  themeConfig: {
    repo: 'danielroe/nuxt-typed-vuex',
    editLinks: true,
    docsDir: 'docs',
    sidebarDepth: 2,
    sidebar: {
      '/': [
        {
          title: 'Setup',
          collapsable: false,
          children: ['/', '/setup', '/using-without-nuxt'],
        },
        {
          title: 'Accessor',
          collapsable: false,
          children: [
            '/accessor/accessor',
            '/accessor/dynamic-modules',
            '/accessor/customisation',
          ],
        },
        {
          title: 'Store',
          collapsable: false,
          children: [
            '/store/state',
            '/store/getters',
            '/store/mutations',
            '/store/actions',
          ],
        },
        {
          title: 'Examples',
          collapsable: false,
          children: ['/examples/build', '/examples/runtime', '/examples/vue'],
        },
      ],
    },
  },
}
