import fs from 'fs'
import https from 'https'
import consola from 'consola'
import express from 'express'

const { Nuxt, Builder } = require('nuxt')
const app = express()

const config = require('../nuxt.config.js')

config.dev = process.env.NODE_ENV !== 'production'

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  let schema
  if (process.env.HTTPS) {
    const httpsOptions = {
      key: fs.readFileSync(`${__dirname}/localhost-key.pem`),
      cert: fs.readFileSync(`${__dirname}/localhost.pem`)
    }
    https.createServer(httpsOptions, app).listen(port, host)
    schema = 'https'
  } else {
    app.listen(port, host)
    schema = 'http'
  }
  consola.ready({
    message: `Server listening on ${schema}://${host}:${port}`,
    badge: true
  })
}
start()
