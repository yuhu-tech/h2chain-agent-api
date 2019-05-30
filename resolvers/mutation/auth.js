const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getUserId, getOpenId } = require('../../utils/utils')
const { CreateAccount, Issue } = require('../../token/ali_token/handle/mutation/mutation')
const { QueryAccount } = require('../../token/ali_token/handle/query/query')
const math = require('math')
const auth = {
  async login(parent, args, ctx, info) {
    //TODO
    //这里需要改下jscode
    var wechat = await getOpenId(args.jscode, 4)
    console.log(wechat)
    const users = await ctx.prismaAgent.users({ where: { wechat: wechat } })
    //在表中找openid，如果找不到，就注册绑定，如果找到了，就直接返回
    var user = users[0]
    if (user == undefined || user == null) {
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
          agentadd: "0xsdjawrhuowajfweradnakjhfdasj22dawed",
          privatekey: "mocked privatekey",
          publickey: "mocked publickey",
          user: { connect: { wechat: wechat } }
        }
      )
      //这里就不用创建钱包了
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
      }
      return true
    } catch (error) {
      throw (error)
    }
  },
}



module.exports = { auth }
