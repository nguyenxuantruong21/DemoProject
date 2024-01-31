const schedule = require('node-schedule')
const { config } = require('dotenv')
const { getDateFromEmail } = require('../utils')
const { sendMailler } = require('./mailler.service')
config()

class ShedulingService {
  static runSheduling = async ({ email, content }) => {
    const listEmail = []
    email.map((el) => {
      listEmail.push(el)
    })
    listEmail.forEach(async (email) => {
      const { dataValues } = await getDateFromEmail(email)
      const dateObject = new Date(dataValues.date)

      // Lấy thông tin về ngày, tháng, năm
      const day = dateObject.getDate()
      const month = dateObject.getMonth() + 1 // Tháng bắt đầu từ 0 (0 là tháng 1)

      // gui vao 0s 43m 15h day month
      schedule.scheduleJob(`0 47 15 ${day} ${month} * `, async () => {
        await sendMailler({ email, content })
        jobExecuted = false
      })
    })
    return {
      message: 'ok'
    }
  }
}

module.exports = ShedulingService
