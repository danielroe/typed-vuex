// const path = require('path')
const { Nuxt, Builder } = require('nuxt-edge')

describe('nuxt-typed-vuex', () => {
  let nuxt

  test('build project', async () => {
    nuxt = new Nuxt(require('./fixture/nuxt.config'))
    await nuxt.ready()

    // Generate before running tests as a known issue
    // Build for more coverage
    const builder = new Builder(nuxt)
    await builder.build()
  }, 60000)

  // test('build files (.nuxt)', async () => {
  //   const buildFiles = klawSync(nuxt.options.buildDir).map(getRelativePath)

  //   expect(buildFiles.filter(noJS)).toMatchSnapshot()
  // })

  // test('generate files (dist)', async () => {
  //   const generateFiles = klawSync(nuxt.options.generate.dir).map(
  //     getRelativePath
  //   )

  //   expect(generateFiles.filter(noJS)).toMatchSnapshot()
  // })
})
