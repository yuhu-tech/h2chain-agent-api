const { getUserId } = require('../../utils/utils')
const messages = require('../../grpc/mutation/mutation_pb');
const services = require('../../grpc/mutation/mutation_grpc_pb');
const grpc = require('grpc');
const config = require('../../conf/config')
const sd = require('silly-datetime')
const formid = require('../../msg/msghandle/formid/redis')
const sendtoh = require('../../msg/msghandle/sendmsg/hotelmsg')
const client = new services.MutationClient(config.localip, grpc.credentials.createInsecure());
const handles = require('../handle/adviser')
const sendtop = require('../../msg/msghandle/sendmsg/ptmsg')

const order = {
  async transmit(parent, args, ctx, info) {
    var request = new messages.TransmitRequest()
    var agentid = getUserId(ctx)
    request.setOrderid(args.orderid)
    request.setAgentid(agentid)
    client.transmitOrder((request,function(err,response){ console.log("转发成功")}))
    return true
  }
}

module.exports = { order }
