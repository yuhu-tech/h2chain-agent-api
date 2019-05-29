var redis = require('redis');
var config = require('../../../conf/config')

var client = redis.createClient(config.RDS.port, config.RDS.host, config.RDS.opts)

// 连接redis
function clientOn() {
    return new Promise((resolve, reject) => {
        client.on('connect', function () { })
        resolve()
    })
}

function clientSet(key, field, value) {
    return new Promise((resolve, reject) => {
        client.hset(key, field, value, function (err, res) {
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
        client.hgetall(key, function (err, res) {
            if (err) {
                reject(err)
            }
            resolve(res)
        })
    })
}

function clientDel(key, field) {
    return new Promise((resolve, reject) => {
        client.hdel(key, field, function (err, res) {
            if (err) {
                reject(err)
            }
            resolve(res)
        })
    })
}

// 存储formId 
var setFormId = async function (userId, orderId, formId) {
    try {
        var key = userId + orderId
        var field = Date.now()
        await clientOn()
        var res = await clientSet(key, field, formId)
        return res
    } catch (error) {
        console.log('存储formid错误:',error)
    }
}

// 获取formId 
var getFormId = async function (key) {
    try {
        await clientOn
        var res = await clientGet(key)
        var fields = []
        var values = []
        var res_field = ''
        var res_value = ''
        for (var field in res) {
            fields.push(field)
            if (res.hasOwnProperty(field)) {
                var element = res[field];
                values.push(element)
            }
        }
        for (var i = 0; i < values.length; i++) {
            var passTime = Date.now() - fields[i]
            var weekTime = 7 * 24 * 3600 * 1000
            if (passTime < weekTime) {
                res_field = fields[i]
                res_value = values[i]
                break
            } else {
                await delFormId(key, fields[i])
            }
        }
        return {
            field: res_field,
            formId: res_value,
        }
    } catch (error) {
        console.log('获取formid错误:',error)
    }
}

// 删除formId 
var delFormId = async function (key, field) {
    try {
        await clientOn
        var res = await clientDel(key, field)
        return res
    } catch (error) {
        console.log('删除formid错误:',error)
    }
}



module.exports = {
    setFormId,
    getFormId,
    delFormId,
};
