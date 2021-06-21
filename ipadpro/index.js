const fs = require('fs')
const axios = require('axios')
const cheerio = require('cheerio')
const { sendMail } = require('../utils/mail')

const target =
    'https://www.apple.com.cn/shop/refurbished/ipad/12-9-%E8%8B%B1%E5%AF%B8-ipad-pro'

const getHtmlCtx = async () => {
    const res = await axios.get(target)

    if (res.status === 200) {
        console.log('HTML获取正常')
        return res.data
    }

    return Promise.reject(res)
}

const resolveHtml = async (html) => {
    return new Promise((resolve) => {
        const $ = cheerio.load(html)

        $('div.refurbished-category-grid-no-js li h3 a').each(function () {
            const text = $(this).text()
            console.log('节点获取正常', text)
            if (~text.indexOf('12.9') && ~text.indexOf('第三代')) {
                resolve(true)
            }
        })
        resolve(false)
    })
}

const main = async () => {
    let html = await getHtmlCtx()
    let hasPad = await resolveHtml(html)
    if (hasPad) {
        console.log('检测到有iPad')
        const info = await sendMail(
            '372002582@qq.com',
            '来了来了他来了, iPad YYDS',
            '链接在此😁',
            target
        )
        console.log('邮件发送成功')
    }
}

main().catch((e) => {
    console.log('[iPad error]:', e)
})
