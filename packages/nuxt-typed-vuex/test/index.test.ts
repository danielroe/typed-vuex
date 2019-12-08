import path from 'path'
import fs from 'fs'

import { Nuxt, Builder, Generator } from 'nuxt'

function walkDir(dir: string, callback: (filename: string) => any) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f)
    const isDirectory = fs.statSync(dirPath).isDirectory()
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f))
  })
}

function iterateOnDirectory(
  directory: string,
  callback: (filename: string) => any
) {
  walkDir(path.resolve(__dirname, directory), filename => callback(filename))
}

describe('nuxt-typed-vuex', () => {
  let nuxt
  let builder

  test('build project', async () => {
    nuxt = new Nuxt(require('./fixture/nuxt.config'))
    await nuxt.ready()

    // Build for more coverage
    builder = new Builder(nuxt)
    await builder.build()
  }, 60000)

  test('build files (.nuxt) includes plugin', async () => {
    const buildFiles = []
    await iterateOnDirectory(nuxt.options.buildDir, filename => {
      buildFiles.push(path.relative(__dirname, filename))
    })
    expect(buildFiles.includes('fixture/.nuxt/nuxt-typed-vuex.js')).toBeTruthy()
  })

  test('generate files', async () => {
    const generator = new Generator(nuxt, builder)
    await generator.generate()
  }, 60000)

  test('generated files (dist) exist', async () => {
    const generatedFiles = []
    iterateOnDirectory(nuxt.options.generate.dir, filename => {
      generatedFiles.push(path.relative(__dirname, filename))
    })
    expect(generatedFiles.includes('fixture/dist/index.html')).toBeTruthy()
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
