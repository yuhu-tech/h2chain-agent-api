const { GraphQLServer } = require('graphql-yoga')
const resolvers = require('../resolvers')
const { prismaHotel } = require('../../h2chain-datamodel/hotel/src/generated/prisma-client')
const { prismaHr } = require('../../h2chain-datamodel/hr/src/generated/prisma-client')
const { prismaClient } = require('../../h2chain-datamodel/client/src/generated/prisma-client')
const { timer } = require('../../h2chain-hotel-api/msg/access_token/schedule/timer')
const { scheduleCronstyle } = require('../resolvers/mutation/clean')
const server = new GraphQLServer({
  typeDefs: './server/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    prismaHotel,
    prismaHr,
    prismaClient
  })
})

// 消息服务 刷新 access_token
timer()
setInterval(timer,3600*1000)
console.log("timer has been set up")

// 订单服务 定时每天 23:59:59 清理订单
scheduleCronstyle()
console.log("clean order interval has been set up")

const options = { port: 4000 }
server.start(options, ({ port }) => console.log('Server is running on http://localhost:4000'));
