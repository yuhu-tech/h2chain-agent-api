const request = require('request')
const config = require('../conf/config')

/*
    查询获取access_token函数
    传入参数：int
        1 表示获取酒店端access_token
        2 表示获取顾问端access_token
        3 表示获取PT端access_token
*/


function getAccessToken(num) {
    return new Promise((resoleve, reject) => {
        var appid = ''
        var secret = ''
        if (num === 1) {
            appid = config.Appids.testHotel
            secret = config.Secrets.testHotel
        }else if (num === 2){
            appid = config.Appids.testAdviser
            secret = config.Secrets.testAdviser
        }else if (num ===3){
            appid = config.Appids.testPt
            secret = config.Secrets.testPt
        }else if (num === 4){
            appid = config.Appids.testAgent
            secret = config.Secrets.testAgent
        }else{
            resoleve()
        }
        const url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + secret;
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

module.exports = {
    getAccessToken
}

