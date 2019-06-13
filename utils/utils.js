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
            appid = config.Appids.hotel
            secret = config.Secrets.hotel
        } else if (num === 2) {
            appid = config.Appids.adviser
            secret = config.Secrets.adviser
        } else if (num === 3) {
            appid = config.Appids.pt
            secret = config.Secrets.pt
        } else if (num === 4){
            appid = config.Appids.agent
            secret = config.Secrets.agent
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


function getAccessToken() {
    return new Promise((resoleve, reject) => {
        var appid = config.Appids.agent
        var secret = config.Secrets.agent
        const url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + secret
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                const access_token = JSON.parse(body).access_token;
                resoleve(access_token)
            } else {
                reject(error)
            }
        });
    })
}


function getNickname(openid, accessToken) {
    return new Promise((resoleve, reject) => {
        const url = 'https://api.weixin.qq.com/sns/userinfo?access_token='+accessToken+'&openid='+openid+'&lang=zh_CN'
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                const userinfo = JSON.parse(body);
                console.log(userinfo)
                resoleve(userinfo.nickname)
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
            appid = config.Appids.hotel
            secret = config.Secrets.hotel
        } else if (num === 2) {
            appid = config.Appids.adviser
            secret = config.Secrets.adviser
        } else if (num === 3) {
            appid = config.Appids.pt
            secret = config.Secrets.pt
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
    getSessionKey,
    getAccessToken,
    getNickname
}
