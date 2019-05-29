const request = require('request')
const templates = require('../model/msgtemplates')
const formId = require('../formid/redis')
const rds = require('../../../utils/redis_accesstoken')


async function sendTemplateMsgToPt(PtMsgData) {
    try {
        //获取access_token 拼接url
        var num = 3
        var access_token = await rds.getAccessToken(num)
        const url = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${access_token}`

        //获取field和formId
        var key = PtMsgData.userId + PtMsgData.orderId
        var getRes = await formId.getFormId(key);

        //获取消息模版,拼接消息内容
        var templateId = ''
        var data = {}
        switch (PtMsgData.num) {
            case 1:
                templateId = templates.PtTIs.msgOne
                data = {
                    "keyword1": {
                        "value": PtMsgData.content.keyword1
                    },
                    "keyword2": {
                        "value": PtMsgData.content.keyword2
                    },
                }
                break;
            case 2:
                templateId = templates.PtTIs.msgTwo
                data = {
                    "keyword1": {
                        "value": PtMsgData.content.keyword1
                    },
                    "keyword2": {
                        "value": PtMsgData.content.keyword2
                    },
                    "keyword3": {
                        "value": PtMsgData.content.keyword3
                    },
                }
                break;
            case 3:
                templateId = templates.PtTIs.msgThree
                data = {
                    "keyword1": {
                        "value": PtMsgData.content.keyword1
                    },
                    "keyword2": {
                        "value": PtMsgData.content.keyword2
                    },
                }
                break;
            default:
                break;
        }

        // 拼接模版消息发送的requestData数据
        const requestData = {
            "touser": PtMsgData.openId,
            "template_id": templateId,
            "page": "index",
            "form_id": getRes.formId,
            "data": data,
        };

        // 发送模版消息
        await request({
            url: url,
            method: 'post',
            body: JSON.stringify(requestData),
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log('服务消息推送成功');
            } else {
                throw error
            }
        });

        //发送完成后删除已使用的formid
        var delres = await formId.delFormId(key, getRes.field)
        console.log('删除结果:' + delres)
    } catch (error) {
        console.log('PT端消息推送失败:', error)
    }

};


module.exports = {
    sendTemplateMsgToPt
};
