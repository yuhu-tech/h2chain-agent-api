const jwt = require('jsonwebtoken')
const config = require('../conf/config')
const request = require('request')


function getUserId(ctx) {
    const Authorization = ctx.request.get('Authorization')
    if (Authorization) {
        const token = Authorization.replace('Bearer ', '')
        const { userId } = jwt.verify(token, 'jwtsecret123')
        return userId
    }

    throw new AuthError()
}

class AuthError extends Error {
    constructor() {
        super('Not authorized')
    }
}

function getOpenId(jsCode, num) {
    return new Promise((resolve, reject) => {
        var appid = ''
        var secret = ''
        if (num === 1) {
            appid = config.Appids.testHotel
            secret = config.Secrets.testHotel
        } else if (num === 2) {
            appid = config.Appids.testAdviser
            secret = config.Secrets.testAdviser
        } else if (num === 3) {
            appid = config.Appids.testPt
            secret = config.Secrets.testPt
        } else {
            resolve()
        }

        const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${jsCode}&grant_type=authorization_code`

        request(url, function (error, response, body) {

            if (!error && response.statusCode == 200) {
                //console.log(body)
                const openid = JSON.parse(body).openid;
                resolve(openid)
            } else {
                reject(error)
            }
        });
    })
}

function getSessionKey(jsCode, num) {
    return new Promise((resolve, reject) => {
        var appid = ''
        var secret = ''
        if (num === 1) {
            appid = config.Appids.testHotel
            secret = config.Secrets.testHotel
        } else if (num === 2) {
            appid = config.Appids.testAdviser
            secret = config.Secrets.testAdviser
        } else if (num === 3) {
            appid = config.Appids.testPt
            secret = config.Secrets.testPt
        } else {
            resolve()
        }

        const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${jsCode}&grant_type=authorization_code`

        request(url, function (error, response, body) {

            if (!error && response.statusCode == 200) {
                //console.log(body)
                const sessionkey = JSON.parse(body).session_key;
                resolve(session_key)
            } else {
                reject(error)
            }
        });
    })
}

module.exports = {
    getUserId,
    AuthError,
    getOpenId,
    getSessionKey
}
