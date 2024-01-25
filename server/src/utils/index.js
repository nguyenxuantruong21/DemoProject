const _ = require('lodash')

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

function getSelectData(inputObject, keysArray) {
  return _.pick(inputObject, keysArray)
}

module.exports = {
  asyncHandler,
  getSelectData
}
