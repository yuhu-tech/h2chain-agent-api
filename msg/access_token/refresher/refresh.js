const GET = require('../../../utils/wx_accesstoken')
const RDS = require('../../../utils/redis_accesstoken')

async function refreshHotelAT (){
    var num = 1
    var key = 'hotel'
    var value = await GET.getAccessToken(num)
    var res = await RDS.setAccessToken(key,value)
    return res
}

async function refreshAdviserAT (){
    var num = 2
    var key = 'adviser'
    var value = await GET.getAccessToken(num) 
    var res = await RDS.setAccessToken(key,value)
    return res
}

async function refreshPtAT (){
    var num = 3
    var key = 'pt'
    var value = await GET.getAccessToken(num) 
    var res = await RDS.setAccessToken(key,value)
    return res
}

module.exports = {
    refreshHotelAT,
    refreshAdviserAT,
    refreshPtAT
}
