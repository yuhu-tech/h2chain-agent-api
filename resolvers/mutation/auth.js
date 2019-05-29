const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getUserId, getOpenId } = require('../../utils/utils')
const { CreateAccount,Issue }  = require('../../token/ali_token/handle/mutation/mutation')
const { QueryAccount } = require('../../token/ali_token/handle/query/query')
const math = require('math')
const auth = {
  async login(parent, args, ctx, info) {
    //TODO
    //这里需要改下jscode
    var wechat = await getOpenId(args.jscode,3)
    console.log(wechat)
    const users = await ctx.prismaAgent.users({ where: { wechat : wechat } })
    //在表中找openid，如果找不到，就注册绑定，如果找到了，就直接返回
    var user = users[0]
    if (user == undefined || user == null ) {
      console.log("can't find this user, registering...")
      var user = await ctx.prismaAgent.createUser({ wechat: wechat })
      var personalmsg = await ctx.prismaAgent.createPersonalmsg(
        {
          name: "",
          phonenumber: "",
          idnumber: "",
          gender: 1,
          height: 0,
          weight: 0,
          status: 2,
          agentadd:"0xsdjawrhuowajfweradnakjhfdasj22dawed",
          privatekey:"mocked privatekey",
          publickey:"mocked publickey",
          user: { connect: { wechat: wechat } }
        }
      )
      //为用户创建钱包
      var keys =  await CreateAccount(personalmsg.id)
      var updatekeys = await ctx.prismaClient.updatePersonalmsg(
        {
          data: {
            privatekey:keys.privateKey,
            publickey:keys.publicKey,
          },
          where: { id : personalmsg.id }
        }
      )
      console.log("创建钱包成功")
       var identity = await QueryAccount(personalmsg.id)
       var updateidentity = await ctx.prismaAgent.updatePersonalmsg(
         {
           data: {
             ptadd : identity.identity
           },
           where: { id : personalmsg.id }
         }
       )
       console.log("更新钱包信息成功")
    }
    return {
      token: jwt.sign({ userId: user.id }, 'jwtsecret123'),
      user
    }
  },

  async modifypersonalmsg(parent, args, ctx, info) {
    const id = getUserId(ctx)
    const users = await ctx.prismaAgent.users({ where: { id } })
    const personalmsgs = await ctx.prismaAgent.personalmsgs({ where: { user: { id: id } } })
    //判断是否是第一次更新个人信息
    var flag = 0
    if ( personalmsgs[0].name == '') {
      flag = 1
    }

    try {
      if (users.length == 0) {
        console.log("can't find this user")
      }
      else {
        const returning = await ctx.prismaAgent.updatePersonalmsg(
          {
            data: {
              name: args.personalmsg.name,
              phonenumber: args.personalmsg.phonenumber,
              idnumber: args.personalmsg.idnumber,
              gender: args.personalmsg.gender,
              height: args.personalmsg.height,
              weight: args.personalmsg.weight,
              status: args.personalmsg.status
            },
            where: { id: personalmsgs[0].id }
          }
        )
        //开始赠送
        if (flag == 1){
           result = await Issue(personalmsgs[0].ptadd ,200)
           console.log(result)
        if (result.output == true){
           var personalmsg = await ctx.prismaHotel.createTx({
             from : "0x6f8f5db4a11573d816094b496502b36b3608e3b505936ee34d7eddc4aeba822c",
             to : personalmsgs[0].ptadd,
             value : 200,
             hash: result.txhash,
             reason: "完善个人信息赠送",
             timestamp: math.round(Date.now()/1000)
           })
          console.log("赠送成功")
         }
        }
      }
      return true
    } catch (error) {
      throw (error)
    }
  },
}



module.exports = { auth }
