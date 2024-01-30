const nodemailer = require('nodemailer')
const { config } = require('dotenv')
config()

class MaillerService {
  static sendMailler = async (email) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    })

    const info = await transporter.sendMail({
      from: 'xuantruong200101@gmail.com', // sender address
      to: email, // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: '<b>Hello world?</b>' // html body
    })
    return info
  }
}

module.exports = MaillerService
