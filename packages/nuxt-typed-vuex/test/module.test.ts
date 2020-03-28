import nuxtModule from 'nuxt-typed-vuex'
import path from 'path'

describe('nuxt module', () => {
  it('exists', () => {
    expect(nuxtModule).toBeDefined()
  })
  it('warns without store defined', () => {
    // @ts-ignore
    global.console = { warn: jest.fn() }
    const addPlugin = jest.fn()
    nuxtModule.call({
      options: {},
      addPlugin,
    })

    expect(console.warn).toBeCalled()
  })
  it('adds plugin', () => {
    const addPlugin = jest.fn()
    nuxtModule.call({
      options: {
        store: {},
      },
      addPlugin,
    })
    expect(addPlugin).toHaveBeenCalled()
    expect(addPlugin.mock.calls[0][0].options.store).toBeDefined()
    expect(path.resolve(addPlugin.mock.calls[0][0].src)).toBeDefined()
  })
})
