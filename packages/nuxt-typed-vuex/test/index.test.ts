import { join, relative, resolve } from 'path'
import { readdirSync, statSync } from 'fs'

import { setupTest, getNuxt } from '@nuxt/test-utils'

const { Nuxt } = require('nuxt')

function walkDir(dir: string, callback: (filename: string) => any) {
  readdirSync(dir).forEach(f => {
    const dirPath = join(dir, f)
    const isDirectory = statSync(dirPath).isDirectory()
    isDirectory ? walkDir(dirPath, callback) : callback(join(dir, f))
  })
}

function iterateOnDirectory(
  directory: string,
  callback: (filename: string) => any
) {
  walkDir(resolve(__dirname, directory), filename => callback(filename))
}

describe('nuxt-typed-vuex build', () => {
  setupTest({
    testDir: __dirname,
    build: true,
    generate: true,
  })

  test('build files (.nuxt) includes plugin', async () => {
    const { options } = getNuxt()

    const buildFiles: string[] = []
    iterateOnDirectory(options.buildDir, filename =>
      buildFiles.push(relative(__dirname, filename))
    )
    expect(buildFiles).toContainEqual(expect.stringMatching('nuxt-typed-vuex.js'))
  })

  test('generated files (dist) exist', async () => {
    const { options } = getNuxt()

    const generatedFiles: string[] = []
    iterateOnDirectory(options.generate.dir!, filename =>
      generatedFiles.push(relative(__dirname, filename))
    )
    expect(generatedFiles).toContainEqual(
      expect.stringMatching(/dist[\\/]index.html/)
    )
  })

  test('plugin fails without store', async () => {
    // @ts-ignore
    global.console = { warn: jest.fn() }
    const emptyNuxt = new Nuxt({
      ...require('./fixture/nuxt.config'),
      srcDir: '.',
    })
    await emptyNuxt.ready()
    expect(console.warn).toBeCalled()
  })
})
