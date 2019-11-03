module.exports = {
  title: '🏦 Nuxt Typed Vuex',
  description: 'Vanilla, strongly-typed store for Nuxt',
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
          children: ['/', '/setup'],
        },
        {
          title: 'Accessor',
          collapsable: false,
          children: [
            '/accessor/accessor',
            '/accessor/dynamic-modules',
            '/accessor/customization',
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
        '/example',
      ],
    },
  },
}
