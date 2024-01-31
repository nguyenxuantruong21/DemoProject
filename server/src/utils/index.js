const db = require('../models/index')

const _ = require('lodash')

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

const getSelectData = (inputObject, keysArray) => {
  return _.pick(inputObject, keysArray)
}

const getDateFromEmail = async (email) => {
  const response = await db.User.findOne({
    where: { email: email }
  })
  return response
}

const formatDate = (dateString) => {
  const [day, month, year] = dateString.split('-').map(Number)
  // Tạo đối tượng Date từ thông tin đã tách
  const dateObject = new Date(Date.UTC(year, month - 1, day))
  // Tạo định dạng ngày giờ mong muốn
  const formattedDate = dateObject.toISOString()
  return formattedDate
}

module.exports = {
  asyncHandler,
  getSelectData,
  getDateFromEmail,
  formatDate
}
