const { debuger } = require('@touno-io/debuger')
const express = require('express')

const middleware = require('./middleware')
const tracking = require('./helper/tracking')

const reqTimeout = 30000
const reqPort = process.env.PORT || 3000
const app = express()
const logger = debuger.scope('LISTENING')
global.listen = null
global.serverName = '@touno-io'

let server = {
  tracking,
  async create (name) {
    if (name) global.serverName = name
    if (global.listen) global.listen.close()
    middleware(app, server)
    app.start = server.start
    return app
  },
  async start () {
    if (global.listen) global.listen.close()
    await startListenServer()
  },
  async close () {
    if (global.listen) global.listen.close()
    logger.success(`Server [${global.serverName}] on port ${reqPort} closed.`)
  }
}

const startListenServer = () => new Promise((resolve, reject) => {
  try {
    global.listen = app.listen(reqPort, () => {
      logger.start(`Server [${global.serverName}] on port ${reqPort} Ready!`)
      resolve()
    })
    global.listen.setTimeout(reqTimeout)
  } catch (ex) {
    reject(ex)
  }
})

module.exports = server
