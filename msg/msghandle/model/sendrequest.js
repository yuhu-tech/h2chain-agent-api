const sd = require('silly-datetime')

// 各端用户发送模版消息，需要的数据模版

const PtMsgData = {
    userId: 'tdergouzi',
    orderId: 'orderid',
    openId: 'o3rzr4pwBwIlkMNoYTxvQiwr1tfY',
    num: 3,
    content: {
        keyword1: '二狗子',
        keyword2: sd.format(new Date(), 'YYYY/MM/DD HH:mm'),
        keyword3: '',
    }
}

const HotelMsgData = {
    userId: 'tdergouzihotel',
    orderId: 'orderid',
    openId: 'oBPW94jJTYE7t_2ZOhlGn2rMS2Go',
    num: 2,
    content: {
        keyword1: '中海人力资源有限公司 二狗子',
        keyword2: sd.format(new Date(), 'YYYY/MM/DD HH:mm'),
        keyword3: '',
    } 
}

const AdviserMsgData = {
    userId: 'tdergouziadviser',
    orderId: 'orderid',
    openId: 'oBKKH5P0IVsVAuoFeBfYF_UaNvTg',
    num: 6,
    content: {
        keyword1: '上海佘山世贸洲际酒店 4/24 男陪玩',
        keyword2: '二狗子',
        keyword3: sd.format(new Date(), 'YYYY/MM/DD HH:mm'),
    }   
}



module.exports = {
    PtMsgData,
    HotelMsgData,
    AdviserMsgData,
}
