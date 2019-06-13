const { GraphQLServer } = require('graphql-yoga')
const resolvers = require('../resolvers')
const { prismaHotel } = require('../../h2chain-datamodel/hotel/src/generated/prisma-client')
const { prismaHr } = require('../../h2chain-datamodel/hr/src/generated/prisma-client')
const { prismaClient } = require('../../h2chain-datamodel/client/src/generated/prisma-client')
const { prismaAgent } = require('../../h2chain-datamodel/agent/src/generated/prisma-client')
const { timer } = require('../../h2chain-hotel-api/msg/access_token/schedule/timer')
const server = new GraphQLServer({
  typeDefs: './server/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    prismaHotel,
    prismaHr,
    prismaClient,
    prismaAgent
  })
})

// 消息服务 刷新 access_token
timer()
setInterval(timer,3600*1000)
console.log("timer has been set up")


const options = { port: 4003 }
server.start(options, ({ port }) => console.log('Server is running on http://localhost:4003'));
