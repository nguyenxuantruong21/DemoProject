const { SuccessResponse } = require('../messages/success.response')
const MaillerService = require('../services/mailler.service')

class MailController {
  static sendMail = async (req, res, next) => {
    const { email, content } = req.body
    new SuccessResponse({
      message: 'Send mail successfully',
      metadata: await MaillerService.sendMailler({ email, content })
    }).send(res)
  }
}

module.exports = MailController
