const { debuger } = require('@touno-io/debuger')
const express = require('express')

const middleware = require('./middleware')

const reqTimeout = 30000
const reqPort = parseInt(process.env.PORT) || 3000
const app = express()
const logger = debuger.scope('router')
let __listen = null

let server = {
  async create () {
    if (__listen) __listen.close()
    middleware(app, server)
    return app
  },
  async start () {
    if (__listen) __listen.close()
    await startListenServer()
  },
  async close () {
    if (__listen) __listen.close()
  }
}

const startListenServer = () => new Promise((resolve, reject) => {
  try {
    __listen = app.listen(reqPort, () => {
      logger.start(`listening on port ${reqPort}!`)
      resolve()
    })
    __listen.setTimeout(reqTimeout)
  } catch (ex) {
    reject(ex)
  }
})

module.exports = server
