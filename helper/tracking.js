module.exports = callback => {
  return (req, res) => callback(req, res).catch(ex => {
    let stack = /at.*?\n/ig.test(ex.stack) ? ex.stack.match(/at.*?\n/ig) : []
    ex.stack = stack.length > 0 ? stack.slice(0, 7).join('') : ex.stack
    logger.error(ex)
    res.status(500).json({ error: ex.message, stack: ex.stack })
  })
}
