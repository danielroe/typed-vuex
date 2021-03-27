import nuxtModule from '../src'

import { setupTest, expectModuleToBeCalledWith } from '@nuxt/test-utils'

describe('nuxt module', () => {
  setupTest({
    testDir: __dirname,
  })
  it('exists', () => {
    expect(nuxtModule).toBeDefined()
  })
  it('adds plugin', () => {
    expectModuleToBeCalledWith('addPlugin', {
      src: expect.stringContaining('template/plugin.js'),
      fileName: 'nuxt-typed-vuex.js',
      options: {
        store: expect.stringContaining('store'),
      },
    })
  })
})
