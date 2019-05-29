var redis = require('redis');
var config = require('../conf/config')

var client = redis.createClient(config.RDS.port, config.RDS.host, config.RDS.opts)

// 连接redis
function clientOn() {
    return new Promise((resolve, reject) => {
        client.on('connect', function () { })
        resolve()
    })
}

function clientSet(key, value) {
    return new Promise((resolve, reject) => {
        client.set(key, value, function (err, res) {
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }
        })
    })
}

function clientGet(key) {
    return new Promise((resolve, reject) => {
        client.get(key, function (err, res) {
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }
        })
    })
}


// 存储access_token
var setAccessToken = async function (key, value) {
    try {
        await clientOn()
        var res = await clientSet(key, value)
        return res
    } catch (error) {
        console.log('redis存储access_token错误:',error)
    }
}

// 获取access_token
var getAccessToken = async function (num) {
    try {
        var key = ''
        if (num === 1) {
            key = 'hotel'
        } else if (num === 2) {
            key = 'adviser'
        } else if (num === 3) {
            key = 'pt'
        } else {

        }
        await clientOn
        var res = await clientGet(key)             
        return res
    } catch (error) {
        console.log('redis中获取access_token错误:',error)
    }
}




module.exports = {
    setAccessToken,
    getAccessToken,
};