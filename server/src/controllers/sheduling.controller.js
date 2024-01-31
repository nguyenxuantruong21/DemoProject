const { SuccessResponse } = require('../messages/success.response')
const ShedulingService = require('../services/sheduling.service')

class ShedulingController {
  static runSheduling = async (req, res, next) => {
    const { email, content } = req.body
    new SuccessResponse({
      message: 'run sheduling successfully',
      metadata: await ShedulingService.runSheduling({ email, content })
    }).send(res)
  }
}

module.exports = ShedulingController
