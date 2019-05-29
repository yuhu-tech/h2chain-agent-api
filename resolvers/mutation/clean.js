var messages = require('../../grpc/mutation/mutation_pb');
var services = require('../../grpc/mutation/mutation_grpc_pb');
var grpc = require('grpc');
var config = require('../../conf/config')
var utils = require('../../token/ali_token/utils/utils')
var math = require('math')
var mutation = require('../../token/ali_token/handle/mutation/mutation')
var schedule = require('node-schedule');
var { prismaHotel } = require('../../../h2chain-datamodel/hotel/src/generated/prisma-client')
var { prismaHr } = require('../../../h2chain-datamodel/hr/src/generated/prisma-client')
var { prismaClient } = require('../../../h2chain-datamodel/client/src/generated/prisma-client')

// 创建和修改用工备注

async function clean() {
  console.log("function begin")
  var client = new services.MutationClient(config.localip, grpc.credentials.createInsecure());
  var request = new messages.CleanRequest();
  var timenow = math.round(Date.now() / 1000)
  console.log(timenow)
  request.setDate(timenow)       // 填入当前时间 unix
  client.cleanOrder(request, async function (err, response) {
    var res = JSON.parse(response.array[0])
    for (i = 0; i < res.orderOrigins.length; i++) {
      // hotel msg
      var hotelprofiles = await prismaHotel.profiles({ where: { user: { id: res.orderOrigins[i].hotelId } } })
      var hotelcer = hotelprofiles[0].hotelcer
      var hoteladdr = hotelprofiles[0].hoteladd
      var hotelname = hotelprofiles[0].name
      var hotelusers = await prismaHotel.users({ where: { id: res.orderOrigins[i].hotelId } })
      var hotelhrname = hotelusers[0].name
      // adviser msg
      var adviserprofiles = await prismaHr.profiles({ where: { user: { id: res.orderOrigins[i].adviserId } } })
      var advisercer = adviserprofiles[0].advisercer
      var adviseraddr = adviserprofiles[0].adviseradd
      var advisername = adviserprofiles[0].companyname
      var adviserusers = await prismaHr.users({ where: { id: res.orderOrigins[i].adviserId } })
      var adviserhrname = adviserusers[0].name
      for (j = 0; j < res.orderOrigins[i].orderCandidates.length; j++) {
        var ptprofiles = await prismaClient.personalmsgs({ where: { user: { id: res.orderOrigins[i].orderCandidates[j].ptId } } })
        var ptcer = ptprofiles[0].idnumber// pt id card number
        var ptaddr = ptprofiles[0].ptadd// pt identity
        var ptname = ptprofiles[0].name
        var occupation = res.orderOrigins[i].job
        if (res.orderOrigins[i].orderHotelModifies.length != 0) {
          datetime = res.orderOrigins[i].orderHotelMofies[0].dateTime
        } else {
          datetime = res.orderOrigins[i].datetime
        }
        var isrefused = res.orderOrigins[i].orderCandidates[j].ptStatus
        //to construct a certain kind of data to be shown on blockchain 
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
        var contract = await prismaHotel.createContract({
          hotelid: res.orderOrigins[i].hotelId,
          adviserid: res.orderOrigins[i].adviserId,
          ptid: res.orderOrigins[i].orderCandidates[j].ptId,
          hash: result.txhash,
          blocknumber: result.blockNumber,
          orderid : res.orderOrigins[i].id
        })
        //分发
        //记录
        if (res.orderOrigins[i].orderCandidates[j].remark !=undefined){
        if ((isrefused == 1 || isrefused == 3) && res.orderOrigins[i].orderCandidates[j].remark.isWorked == 1) {
          //TODO 备注里查找未参加工作的也不送
          result = await mutation.Issue(ptprofiles[0].ptadd, 200)
          if (result.output == true) {
            var finishwork = prismaHotel.createTx({
              from: "0x6f8f5db4a11573d816094b496502b36b3608e3b505936ee34d7eddc4aeba822c",
              to: ptprofiles[0].ptadd,
              value: 200,
              hash: result.txhash,
              reason: "完成订单",
              timestamp: math.round(Date.now() / 1000)
            })
          }
        }
        }
      }
    }
  }
  )
}



async function scheduleCronstyle() {
  schedule.scheduleJob('59 * * * * *', async function () {
      await clean()
  });
}

module.exports = {
  scheduleCronstyle
}
