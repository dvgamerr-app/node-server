# @touno-io/server

### Installation
```bash
npm i @touno-io/server
// or
yarn i @touno-io/server
```

**sample**
```javascript
const serv = require('@touno.io/server')

serv.create('web.opensource').then(async app => {
  app.get('/test', serv.tracking(async (req, res) => {
    res.end('test')
  }))

  await app.start()
}).catch(ex => {
  console.log(ex)
  await serv.close()
  process.exit(1)
})

```
----------
### License
MIT © 2018 Touno™
