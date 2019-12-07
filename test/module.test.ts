import nuxtModule from '../lib/index'
import path from 'path'

describe.only('nuxt module', () => {
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
    ;['utils', 'store'].forEach(option => {
      expect(Object.keys(addPlugin.mock.calls[0][0].options).includes(option))
    })
    expect(path.resolve(addPlugin.mock.calls[0][0].src)).toBeDefined()
  })
})
