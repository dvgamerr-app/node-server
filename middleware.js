
import { Raven, debuger } from '@touno-io/debuger'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'


const logger = debuger.scope('router')
module.exports = (app, server) => {
  app.use((req, res, next) => {
    const methodAllow = [ 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT' ]
    const headerAllow = [
      'Authorization',
      'X-Requested-With',
      'Content-Type'
    ]
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', methodAllow.join(','))
    res.setHeader('Access-Control-Allow-Headers', headerAllow.join(','))
    if (req.method === 'OPTIONS') return res.sendStatus(200)
    next()
  })

  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.use((req, res, next) => {
    logger.info(`${req.method.toLocaleUpperCase()} - ${req.url}`)
    next()
  })

  app.use((err, req, res, next) => {
    logger.error(`${req.method.toLocaleUpperCase()} - ${req.url}`)
    logger.error(err)
    res.status(500).json({ error: err.message })
  })

  app.get('/online', (req, res) => {
    res.json({ online: true })
  })

  app.post('/restart/:password', (req, res) => Raven.Tracking(async () => {
    if (process.env.SERVER_PASSWORD) {
      try {
        let { params } = req

        if (!params || params.password !== process.env.SERVER_PASSWORD) throw new Error('server is not restart.')
        await server.start()
        logger.info('request restarted.')
        res.status(200).end()
      } catch (ex) {
        res.status(500).end(ex.message)
      }
    } else {
      res.status(500).end('disabled')
    }
  }, true))
}
