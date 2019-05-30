const { getUserId } = require('../../utils/utils')
const handles = require('../handle/agent')
const { QueryTransaction } = require('../../token/ali_token/handle/query/query')
const utils = require('../../token/ali_token/utils/utils')
const query = {
  //my information and my profile
  async me(parent, args, ctx, info) {
    const id = getUserId(ctx)
    const users = await ctx.prismaAgent.users({ where: { id } })
    const profiles = await ctx.prismaAgent.profiles({ where: { user: { id: id } } })
    var meResult = {
      id: users[0].id,
      name: users[0].name,
      email: users[0].email,
      profile: profiles[0]
    }
    return meResult
  },
  
  async search(parent, args, ctx, info) {
    const id = getUserId(ctx)
    if (args.status == 2) {
      doing = await handles.AgentGetOrderList(ctx, id, args.orderid, 2, args.datetime, args.ptname);
      return doing
    } else {
      return handles.AgentGetOrderList(ctx, id, args.orderid, args.status, args.datetime, args.ptname)
    }
  }
}
module.exports = { query }
