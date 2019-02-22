const { debuger } = require('@touno-io/debuger')

module.exports = callback => {
  return (req, res, next) => callback(req, res, next).catch(async ex => {
    const logger = debuger.scope('API-' + req.method)
    let stack = /at.*?\n/ig.test(ex.stack) ? ex.stack.match(/at.*?\n/ig) : []
    ex.stack = stack.length > 0 ? stack.slice(0, 7).join('') : ex.stack
    await logger.error(ex)
    res.status(500).json({ error: ex.message, stack: ex.stack })
  })
}
