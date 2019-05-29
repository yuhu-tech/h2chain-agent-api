const { getUserId } = require('../../utils/utils')
const messages = require('../../grpc/mutation/mutation_pb');
const services = require('../../grpc/mutation/mutation_grpc_pb');
const grpc = require('grpc');
const config = require('../../conf/config')
const sd = require('silly-datetime')
const sendtoa = require('../../msg/msghandle/sendmsg/advisermsg')
const sendtop = require('../../msg/msghandle/sendmsg/ptmsg')
const formid = require('../../msg/msghandle/formid/redis')
const client = new services.MutationClient(config.localip, grpc.credentials.createInsecure());
const handles = require('../handle/hotel')
const utils = require('../../token/ali_token/utils/utils')
const mutation = require('../../token/ali_token/handle/mutation/mutation')
const querymessages = require('../../grpc/query/query_pb');
const queryservices = require('../../grpc/query/query_grpc_pb');
const queryclient = new queryservices.QueryOrderClient(config.localip, grpc.credentials.createInsecure())
const {Issue} = require('../../token/ali_token/handle/mutation/mutation')
const math = require('math')


function queryRemark(request) {
  return new Promise((resolve, reject) => {
      queryclient.queryRemark(request, (err, date) => {
          if (err) reject(err);
          resolve(date);
      })
  })
}

const order = {
  async createorder(parent, args, ctx, info) {
    const id = getUserId(ctx) //retrieve userid to put it into hotelId
    const users = await ctx.prismaHr.users({ where: { name: args.createorder.advisername } })
    var request = new messages.CreateRequest();
    request.setHotelid(id)  //hotelid can be received for ctx utils
    request.setAdviserid(users[0].id)  // adviser name can be received from adviser_name
    request.setJob(args.createorder.occupation)
    request.setDate(args.createorder.datetime)
    request.setDuration(args.createorder.duration)
    request.setCount(args.createorder.count)
    request.setCountmale(args.createorder.male)
    request.setMode(args.createorder.mode)
    client.createOrder(request, async function (err, response) {
      // set formid which is created when hotel create order
      var userId = id
      var orderId = response.array[0]
      var formId = args.formid
      var setRes = await formid.setFormId(userId, orderId, formId)
      console.log('set formid after creating :', setRes)
    });
  },
  //only createorder will use callback to retrive orderid others will only use search to query orderid and other
  //messages

  async modifyorder(parent, args, ctx, info) {
    const id = getUserId(ctx)
    var request = new messages.ModifyRequest();
    request.setOrderid(args.modifiedorder.orderid);
    request.setDatechanged(args.modifiedorder.changeddatetime);
    request.setDurationchanged(args.modifiedorder.changedduration);             //为修改的数据，传 -1 或者 原数据值
    request.setCountchanged(args.modifiedorder.changedcount);
    request.setCountmalechanged(args.modifiedorder.changedmale);
    request.setMode(args.modifiedorder.changedmode);
    await client.modifyOrder(request, function (err, response) { console.log(response.array) })

    //we need to change the state of pt to order to 4 for the pts to decide if they will go.
    var request = new messages.ModifyPtRequest();
    request.setOrderid(args.modifiedorder.orderid);       // OrderID 必传
    request.setTargetstatus(4);                           // PT 目标状态 筛选条件，不同传 -1  
    request.setSourcestatus(1);                           // PT 原始状态
    client.modifyPTOfOrder(request, async function (err, response) {
      console.log(response.array)
      //to retrieve the whole meaage
      todo = await handles.HotelGetOrderList(ctx, id, args.orderid, 2)
      // set formid which is created when hotel modify order
      var userId = todo[0].originorder.hotelid
      var orderId = args.modifiedorder.orderid
      var formId = args.formid
      var setRes = await formid.setFormId(userId, orderId, formId)
      console.log('set formid after modifying :', setRes)

      // we will fetch adviserid and orderid and openid
      // send msg to adviser after modifying
      var advisers = await ctx.prismaHr.users({ where: { id: todo[0].originorder.adviserid } })
      var timekeyword = ''
      var countkeyword = ''
      var malekeyword = ''
      var femalekeyword = ''
      var general = '酒店修改用工信息：'
      var dateorigin = todo[0].originorder.datetime
      var datemodified = todo[0].modifiedorder[0].changeddatetime
      var fdateorigin = new Date(dateorigin * 1000)
      var fdatemodified = new Date(datemodified * 1000)

      if (dateorigin != datemodified) {
        timekeyword = '用工时间由' + fdateorigin.getFullYear() + '年' + (fdateorigin.getMonth() + 1) + '月' + fdateorigin.getDate() + '日' + fdateorigin.getHours() + '时'
          + '  更改为  ' + fdatemodified.getFullYear() + '年' + (fdatemodified.getMonth() + 1) + '月' + fdatemodified.getDate() + '日' + fdatemodified.getHours() + '时'
      }
      if (todo[0].modifiedorder[0].changedcount != todo[0].originorder.count) {
        countkeyword = '用工人数由' + todo[0].originorder.count + '更改为' + todo[0].modifiedorder[0].changedcount
      }

      //compose AdviserMsgData
      var AdviserMsgData = {
        userId: todo[0].originorder.adviserid, //向谁发送？
        orderId: args.modifiedorder.orderid,//这个orderid
        openId: advisers[0].wechat, //向谁发送的openid
        num: 4,
        content: {
          keyword1: general + timekeyword + countkeyword,
          keyword2: sd.format(new Date(), 'YYYY/MM/DD HH:mm'),
          keyword3: '',
        }
      }
      var sendARes = await sendtoa.sendTemplateMsgToAdviser(AdviserMsgData)
      console.log('send msg to adviser after modifying', sendARes)
    })


    // send msg to registried pts after modifying
    // there should be a pt list , have to use for() to handle
    if (todo[0].pt.length) {
      for (i = 0; i < todo[0].pt.length; i++) {
        //to retrieve openid
        var users = await ctx.prismaClient.users({ where: { id: todo[0].pt[i].ptid } })
        var openId = users[0].wechat
        var PtMsgData = {
          userId: todo[0].pt[i].ptid,
          orderId: args.modifiedorder.orderid,
          openId: openId,
          num: 1,
          content: {
            keyword1: '尊敬的客户，酒店已经更改用工信息',
            keyword2: sd.format(new Date(), 'YYYY/MM/DD HH:mm'),
            keyword3: '',
          }
        }
        var sendPRes = await sendtop.sendTemplateMsgToPt(PtMsgData)
        console.log('send msg to pt after modifying', sendPRes)
      }
    }
  },

  async closeorder(parent, args, ctx, info) {
    const id = getUserId(ctx)
    var client = new services.MutationClient(config.localip, grpc.credentials.createInsecure());
    var request = new messages.CloseRequest();
    request.setOrderid(args.orderid)
    client.closeOrder(request, async function (err, response) {
      // send msg to adviser after closing
      const todo = await handles.HotelGetOrderList(ctx, id, args.orderid, 3)
      console.log(JSON.stringify(todo))
      userId = todo[0].originorder.adviserid
      var hotels = await ctx.prismaHotel.users({ where: { id: id } })
      var profiles = await ctx.prismaHotel.profiles({ where: { user: { id: id } } })
      var name = hotels[0].name
      var hotelname = profiles[0].name
      var occupation = todo[0].originorder.occupation
      if (todo[0].modifiedorder.length) {
        datetime = todo[0].modifiedorder[0].changeddatetime
      } else {
        datetime = todo[0].originorder.datetime
      }
      var fdatetime = new Date(datetime * 1000)
      var advisers = await ctx.prismaHr.users({ where: { id: todo[0].userId } })
      var AdviserMsgData = {
        userId: userId,
        orderId: todo[0].originorder.orderid,
        openId: advisers[0].wechat,
        num: 6,
        content: {
          keyword1: hotelname + fdatetime.getFullYear() + '年' + (fdatetime.getMonth() + 1) + '月' + fdatetime.getDate() + '日' + fdatetime.getHours() + '时的' + occupation + "工作已被关闭",
          keyword2: name,
          keyword3: sd.format(new Date(), 'YYYY/MM/DD HH:mm'),
        }
      }
      var sendARes = await sendtoa.sendTemplateMsgToAdviser(AdviserMsgData)
      console.log('send msg to adviser after closing', sendARes)
      // send msg to registried pts after closing
      // there should be a pt list , have to use for() to handle
      if (todo[0].pt.length) {
        for (i = 0; i < todo[0].pt.length; i++) {
          //to retrieve openid
          var users = await ctx.prismaClient.users({ where: { id: todo[0].pt[i].ptid } })
          var openId = users[0].wechat
          var PtMsgData = {
            userId: todo[0].pt[i].ptid,
            orderId: args.orderid,
            openId: openId,
            num: 3,
            content: {
              keyword1: hotelname + fdatetime.getFullYear() + '年' + (fdatetime.getMonth() + 1) + '月' + fdatetime.getDate() + '日' + fdatetime.getHours() + '时的' + occupation + "工作已被关闭",
              keyword2: name,
              keyword3: sd.format(new Date(), 'YYYY/MM/DD HH:mm'),
            }
          }
          var sendPRes = await sendtop.sendTemplateMsgToPt(PtMsgData)
          console.log('send msg to pt after closing', sendPRes)
        }
      }

      // hotel msg
      var hotelprofiles = await ctx.prismaHotel.profiles({ where: { user: { id: id } } })
      var hotelcer = hotelprofiles[0].hotelcer
      var hoteladdr = hotelprofiles[0].hoteladd
      var hotelname = hotelprofiles[0].name
      var hotelusers = await ctx.prismaHotel.users({ where: { id: id } })
      var hotelhrname = hotelusers[0].name
      // adviser msg
      console.log("todo[0] is " + JSON.stringify(todo[0]))
      var adviserprofiles = await ctx.prismaHr.profiles({ where: { user: { id: todo[0].originorder.adviserid } } })
      var advisercer = adviserprofiles[0].advisercer
      var adviseraddr = adviserprofiles[0].adviseradd
      var advisername = adviserprofiles[0].companyname
      var adviserusers = await ctx.prismaHr.users({ where: { id: todo[0].originorder.adviserid } })
      var adviserhrname = adviserusers[0].name
      // pt msg
      console.log("todo[0] is " + JSON.stringify(todo[0]))
      if (todo[0].pt.length) {
        for (j = 0; j < todo[0].pt.length; j++) {
          var ptprofiles = await ctx.prismaClient.personalmsgs({ where: { user: { id: todo[0].pt[j].ptid } } })
          var ptcer = ptprofiles[0].idnumber// pt id card number
          var ptaddr = ptprofiles[0].ptadd// pt identity
          var ptname = ptprofiles[0].name
          var occupation = todo[0].originorder.occupation
          if (todo[0].modifiedorder.length) {
            datetime = todo[0].modifiedorder[0].changeddatetime
          } else {
            datetime = todo[0].originorder.datetime
          }
          var isrefused = todo[0].pt[j].ptorderstate
          //now we set on chain
          var data = {
            hotelcer: hotelcer,
            hoteladdr: hoteladdr,
            hotelname: hotelname,
            hotelhrname: hotelhrname,

            advisercer: advisercer,
            adviseraddr: adviseraddr,
            advisername: advisername,
            adviserhrname: adviserhrname,

            ptcer: ptcer,
            ptaddr: ptaddr,
            ptname: ptname,

            occupation: occupation,
            datetime: datetime,
            isrefused: isrefused,
          }
          var dataStr = JSON.stringify(data)
          var hashData = await utils.Str2Hex(dataStr)
          var result = await mutation.NativeDepositData(hashData.hex)
          //to save the data to local
          var contract = await ctx.prismaHotel.createContract({
            hotelid: id,
            adviserid: todo[0].originorder.adviserid,
            ptid: todo[0].pt[j].ptid,
            hash: result.txhash,
            blocknumber: result.blockNumber,
            orderid : todo[0].originorder.orderid
          })

          var requestremark = new querymessages.QueryRemarkRequest()
          requestremark.setOrderid(todo[0].originorder.orderid)
          requestremark.setPtid(todo[0].pt[j].ptid)
          var responseremark = await queryRemark(requestremark)
          var resremark = JSON.parse(responseremark.array[0])
          if (resremark.orderCandidates[0].remark != undefined) {
            if ((isrefused == 1 || isrefused == 3) && resremark.orderCandidates[0].remark.isWorked == 1) {
              console.log("上链并赠送token")
              result = await Issue(ptprofiles[0].ptadd, 200)
              if (result.output == true) {
                var finishwork = ctx.prismaHotel.createTx({
                  from: "0x6f8f5db4a11573d816094b496502b36b3608e3b505936ee34d7eddc4aeba822c",
                  to: ptprofiles[0].ptadd,
                  value: 200,
                  hash: result.txhash,
                  reason: "完成订单",
                  timestamp: math.round(Date.now() / 1000)
                })
                console.log("上链成功！")
              }
            }
          }
        }
      }
    })
  }
}

module.exports = { order }
