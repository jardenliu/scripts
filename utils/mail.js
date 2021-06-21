let argv = require('argv')
const nodemailer = require('nodemailer')

const nickname = '流君酱'
const fromMail = 'jarden@qq.com'
const fromLabel = `${nickname}"<${fromMail}>`

argv.option({
    name: 'key',
    short: 'k',
    type: 'string',
    description: 'key',
    example: "'script --key=abc' or 'script -key abc'"
})
let args = argv.run()

const transporter = nodemailer.createTransport({
    service: 'QQ',
    auth: {
        user: 'jarden@qq.com',
        pass: args.options.key
    }
})

const generateReceiver = (to, subject, title, html) => {
    let text
    if (html) {
        html = `<h1>${title || ''}</h1> 
        ${html}`
    } else {
        text = title
    }

    const receiver = {
        from: fromLabel,
        subject,
        to,
        text,
        html
    }
    return receiver
}

const sendMail = async (to, subject, title, html) => {
    const receiver = generateReceiver(to, subject, title, html)
    const info = await transporter.sendMail(receiver)
    return info
}

module.exports = {
    transporter,
    sendMail,
    generateReceiver
}
