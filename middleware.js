
const { debuger, DevMode } = require('@touno-io/debuger')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const logger = debuger.scope('router')
const Tracking = require('./helper/tracking')

module.exports = (app, server) => {
  app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json')

    if (DevMode) {
      const methodAllow = [ 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT' ]
      const headerAllow = [ 'Authorization', 'X-Requested-With', 'Content-Type' ]
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Credentials', 'true')
      res.setHeader('Access-Control-Allow-Methods', methodAllow.join(','))
      res.setHeader('Access-Control-Allow-Headers', headerAllow.join(','))
    }
    if (req.method === 'OPTIONS') return res.sendStatus(200)
    next()
  })

  // create a write stream (in append mode)
  if (!fs.existsSync(path.join(__dirname, 'logs'))) fs.mkdirSync(path.join(__dirname, 'logs'))
  let accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), { flags: 'a' })

  // setup the logger
  if (DevMode) {
    app.use(morgan((t, req, res) => {
      let length = t.res(req, res, 'content-length')
      let scope = `API-${t.method(req, res)}`
      let logs = `${t.status(req, res)} ${t.url(req, res)} ${length ? `(${length} bytes)` : ''} - ${t['response-time'](req, res)}ms`
      debuger.scope(scope).log(logs)
      return
    }))
  } else {
    let logsFormat = ':date[iso] [:method] :status (:response-time ms) :url HTTP/:http-version > :remote-addr :res[content-length] ":referrer" ":user-agent"'
    app.use(morgan(logsFormat, { stream: accessLogStream }))
  }

  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.use((err, req, res, next) => {
    logger.error(err)
    res.status(500).json({ error: err.message })
  })

  app.get('/online', Tracking(async (req, res) => {
    res.json({ online: true })
  }))
}
