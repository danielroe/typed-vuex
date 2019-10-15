const path = require('path')
const fs = require('fs')

const { Nuxt, Builder } = require('nuxt-edge')

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f)
    const isDirectory = fs.statSync(dirPath).isDirectory()
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f))
  })
}

function iterateOnDirectory(directory, callback) {
  walkDir(path.resolve(__dirname, directory), path =>
    callback(path, fs.existsSync(path) && fs.readFileSync(path, 'utf8'))
  )
}

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

  test('build files (.nuxt) includes plugin', async () => {
    const buildFiles = []
    iterateOnDirectory(nuxt.options.buildDir, filename => {
      buildFiles.push(path.relative(__dirname, filename))
    })
    expect(buildFiles.includes('fixture/.nuxt/nuxt-typed-vuex.js'))
  })
})
