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
    //TODO 需要改动此接口
    const id = getUserId(ctx)
    var request = new messages.PostRequest('');
    request.setOrderid(args.postorder.orderid);    //发布订单的Id(可以通过订单创建接口得到)
    request.setIsfloat(args.postorder.isfloat);                              //雇佣人数是否浮动
    request.setHourlysalary(args.postorder.salary);                        //时薪
    request.setWorkcontent(args.postorder.workcontent);             //工作内容
    request.setAttention(args.postorder.attention);                   //注意事项
    client.postOrder(request, function (err, response) {});
    //TODO  we will add formid into args in graphql
    // set formid which is created when adviser post order
    var userId = id
    var orderId = args.postorder.orderid
    var formId = args.formid
    var setRes = await formid.setFormId(userId, orderId, formId)
    console.log('set formid after creating :', setRes)

    var todo = await handles.AdviserGetOrderList(ctx, id, args.postorder.orderid, 0)
    var doing = await handles.AdviserGetOrderList(ctx, id, args.postorder.orderid, 1)
    Array.prototype.push.apply(todo, doing)
    var hotelUsers = await ctx.prismaHotel.users({ where: { id: todo[0].originorder.hotelid } })
    // send msg to hotel after posting

    // we will fulfill all the blanks in the messages
    var advisers = await ctx.prismaHr.users({where :{id:id}})
    var profiles = await ctx.prismaHr.profiles({where:{user:{id:advisers[0].id}}})
    var advisername = advisers[0].name
    var advisercompany = profiles[0].companyname
    var occupation = todo[0].originorder.occupation
    if (todo[0].modifiedorder.length){
      var datetime = todo[0].modifiedorder[0].changeddatetime
    } else {
      var datetime = todo[0].originorder.datetime
    }
    var date = new Date(datetime*1000)
    var HotelMsgData = {
      userId: todo[0].originorder.hotelid,
      orderId: todo[0].originorder.orderid,
      openId:  hotelUsers[0].wechat,
      num: 1,
      content: {
        keyword1: advisercompany + ' '+ advisername,
        keyword2: date.getFullYear()+'年'+ (date.getMonth()+1) +'月'+date.getDate()+'日'+date.getHours()+'时开始' + ' ' + occupation,
        keyword3: sd.format(new Date(), 'YYYY/MM/DD HH:mm'),
      }
    }
    var sendHRes = await sendtoh.sendTemplateMsgToHotel(HotelMsgData);
    console.log('send msg to hotel after posting', sendHRes)
    var error = false
    return error
  }
}

module.exports = { order }
