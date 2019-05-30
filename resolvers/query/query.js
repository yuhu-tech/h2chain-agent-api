const { getUserId } = require('../../utils/utils')
const handles = require('../handle/agent')
const { QueryTransaction } = require('../../token/ali_token/handle/query/query')
const utils = require('../../token/ali_token/utils/utils')
const query = {
  //my information and my profile
  async me(parent, args, ctx, info) {
    console.log("begin searching me ")
    const id = getUserId(ctx)
    const users = await ctx.prismaAgent.users({ where: { id } })
    const personalmsgs = await ctx.prismaAgent.personalmsgs({ where: { user: { id: id } } })
    var result = {
      id: id,
      wechat: users[0].wechat,
      personalmsgs: personalmsgs[0]
    }
    return result
  },
  async search(parent, args, ctx, info) {
    const id = getUserId(ctx)
    if (args.state == 11) {
      doing = await handles.AgentGetOrderList(ctx, id, args.orderid, 2, args.datetime, args.ptname);
      return doing
    } else {
      return handles.AgentGetOrderList(ctx, id, args.orderid, args.state, args.datetime, args.ptname)
    }
  }
}
module.exports = { query }
