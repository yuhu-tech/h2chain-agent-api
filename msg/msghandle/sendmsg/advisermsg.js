const request = require('request')
const templates = require('../model/msgtemplates')
const formId = require('../formid/redis')
const rds = require('../../../utils/redis_accesstoken')



async function sendTemplateMsgToAdviser(AdviserMsgData) {
    try {
        //获取access_token 拼接url
        var num = 2
        var access_token = await rds.getAccessToken(num)
        const url = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${access_token}`

        //获取field和formId
        var key = AdviserMsgData.userId + AdviserMsgData.orderId
        var getRes = await formId.getFormId(key);

        //获取消息模版,拼接消息内容
        var templateId = ''
        var data = {}
        switch (AdviserMsgData.num) {
            case 1:
                templateId = templates.AdviserTIs.msgOne
                data = {
                    "keyword1": {
                        "value": AdviserMsgData.content.keyword1
                    },
                    "keyword2": {
                        "value": AdviserMsgData.content.keyword2
                    },
                }
                break;
            case 2:
                templateId = templates.AdviserTIs.msgTwo
                data = {
                    "keyword1": {
                        "value": AdviserMsgData.content.keyword1
                    },
                    "keyword2": {
                        "value": AdviserMsgData.content.keyword2
                    },
                    "keyword3": {
                        "value": AdviserMsgData.content.keyword3
                    },
                }
                break;
            case 3:
                templateId = templates.AdviserTIs.msgThree
                data = {
                    "keyword1": {
                        "value": AdviserMsgData.content.keyword1
                    },
                    "keyword2": {
                        "value": AdviserMsgData.content.keyword2
                    },
                    "keyword3": {
                        "value": AdviserMsgData.content.keyword3
                    },
                }
                break;
            case 4:
                templateId = templates.AdviserTIs.msgFour
                data = {
                    "keyword1": {
                        "value": AdviserMsgData.content.keyword1
                    },
                    "keyword2": {
                        "value": AdviserMsgData.content.keyword2
                    },
                }
                break;
            case 5:
                templateId = templates.AdviserTIs.msgFive
                data = {
                    "keyword1": {
                        "value": AdviserMsgData.content.keyword1
                    },
                    "keyword2": {
                        "value": AdviserMsgData.content.keyword2
                    },
                    "keyword3": {
                        "value": AdviserMsgData.content.keyword3
                    },
                }
                break;
            case 6:
                templateId = templates.AdviserTIs.msgSix
                data = {
                    "keyword1": {
                        "value": AdviserMsgData.content.keyword1
                    },
                    "keyword2": {
                        "value": AdviserMsgData.content.keyword2
                    },
                    "keyword3": {
                        "value": AdviserMsgData.content.keyword3
                    },
                }
                break;
            default:
                break;
        }

        // 拼接模版消息发送的requestData数据
        const requestData = {
            "touser": AdviserMsgData.openId,
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
        console.log('顾问端消息推送失败:', error)
    }
};


module.exports = {
    sendTemplateMsgToAdviser
};
