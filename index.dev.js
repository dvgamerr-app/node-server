const serv = require('./index')

serv.create('web.opensource').then(async app => {
  app.get('/data', serv.tracking(async (req, res) => {
    res.end('data')
  }))
  await app.start()
  await serv.close()
}).catch(ex => {
  console.log(ex)
})