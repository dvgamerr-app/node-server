const request = require('request-promise')
const serv = require('./index')

serv.create('web.opensource').then(async app => {
  app.get('/pass', serv.tracking(async (req, res) => {
    res.json({ error: false })
  }))
  app.get('/fail', serv.tracking(async (req, res) => {
    throw new Error('testing fail')
  }))
  await app.start()
  try {
    let data = await request('http://localhost:3000/pass')
    if (data.error) throw new Error('Tracking router Pass: false')

    data = await request('http://localhost:3000/fail')
    if (!data.error) throw new Error('Tracking router fail: false')
  } catch (ex) {
    
  }

  await serv.close()
  process.exit(0)
}).catch(ex => {
  console.log(ex)
})