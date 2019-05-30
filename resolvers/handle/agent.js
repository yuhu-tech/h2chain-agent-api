var messages = require('../../grpc/query/query_pb');
var services = require('../../grpc/query/query_grpc_pb');
var grpc = require('grpc');
var config = require('../../conf/config')
var client = new services.QueryOrderClient(config.localip, grpc.credentials.createInsecure())


// 酒店端订单页面
function queryOrderOfAgent(request) {
  return new Promise((resolve, reject) => {
    client.queryOrderOfAgent(request, (err, date) => {
      if (err) reject(err);
      resolve(date);
    })
  })
}

function queryPt(request) {
  return new Promise((resolve, reject) => {
    client.queryPTOfOrder(request, (err, date) => {
      if (err) reject(err);
      resolve(date);
    })
  })
}


function queryHistory(request) {
  return new Promise((resolve, reject) => {
    client.queryExperience(request, (err, date) => {
      if (err) reject(err);
      resolve(date);
    })
  })
}

async function AgentSearchHistory(ctx, ptid) {
  var request = new messages.QueryExperienceRequest();
  request.setPtid(ptid)
  var response = await queryHistory(request)
  var res = JSON.parse(response.array[0])
  var history = []
  if (res.orderOrigins.length < 5) {
    var worked = {}
    for (i = 0; i < res.orderOrigins.length; i++) {
      //worked['hotelid'] = res.orderOrigins[0].hotelId;
      worked['occupation'] = res.orderOrigins[0].job;
      var users = await ctx.prismaHotel.users({ where: { id: res.orderOrigins[0].hotelId } })
      var profiles = await ctx.prismaHotel.profiles({ where: { user: { id: res.orderOrigins[0].hotelId } } })
      worked['hotelname'] = profiles[0].name
      history.push(worked)
    }
  } else {
    var worked = {}
    for (i = 0; i < 5; i++) {
      //worked['hotelid'] = res.orderOrigins[0].hotelID;
      worked['occupation'] = res.orderOrigins[0].job;
      var users = await ctx.prismaHotel.users({ where: { id: res.orderOrigins[0].hotelId } })
      var profiles = await ctx.prismaHotel.profiles({ where: { user: { id: res.orderOrigins[0].hotelId } } })
      worked['hotelname'] = profiles[0].name
      history.push(worked)
    }
  }
  return history
}

async function AgentGetOrderList(ctx, agentid, orderid, status, datetime, ptname) {
  try {
    var request = new messages.QueryOOARequest();
    if (agentid != null && agentid != undefined) {
      request.setAgentid(agentid)
    }
    if (status != null && status != undefined) {
      request.setStatus(status)
    }

    var response = await queryOrderOfAgent(request);
    for (var i = 0; i < response.array.length; i++) {
      var res = JSON.parse(response.array[i])
      var obj = {}

      var modifiedorder = []
      var isModified = false
      if (res.orderOrigins[0].orderHotelModifies.length != 0) {
        isModified = true
        for (var j = 0; j < res.orderOrigins[0].orderHotelModifies.length; j++) {
          var modifiedorderObj = {}
          modifiedorderObj['orderid'] = res.orderOrigins[0].id
          modifiedorderObj['changeddatetime'] = res.orderOrigins[0].orderHotelModifies[j].dateTime
          modifiedorderObj['changedduration'] = res.orderOrigins[0].orderHotelModifies[j].duration / 3600
          modifiedorderObj['changedmode'] = res.orderOrigins[0].orderHotelModifies[j].mode
          modifiedorderObj['changedcount'] = res.orderOrigins[0].orderHotelModifies[j].count
          // there are two conditions: 1) if changed mode = 0 ,we set changed male and change female = 0 else we will
          // set the female  = count - male
          if (modifiedorderObj['changedmode'] == 0) {
            modifiedorderObj['changedmale'] = 0
            modifiedorderObj['changedfemale'] = 0
          } else {
            modifiedorderObj['changedmale'] = res.orderOrigins[0].orderHotelModifies[j].countMale
            modifiedorderObj['changedfemale'] = res.orderOrigins[0].orderHotelModifies[j].count - res.orderOrigins[0].orderHotelModifies[j].countMale
          }
          modifiedorder.push(modifiedorderObj)
        }
      }

      var originorder = {}
      originorder['hotelid'] = res.orderOrigins[0].hotelId
      originorder['adviserid'] = res.orderOrigins[0].adviserId
      originorder['orderid'] = res.orderOrigins[0].id
      originorder['occupation'] = res.orderOrigins[0].job
      originorder['datetime'] = res.orderOrigins[0].datetime
      originorder['duration'] = res.orderOrigins[0].duration / 3600
      originorder['mode'] = res.orderOrigins[0].mode
      originorder['orderstate'] = res.orderOrigins[0].status - 1

      if (res.orderOrigins[0].orderAdviserModifies.length != 0) {
        if (res.orderOrigins[0].orderAdviserModifies[0].isFloat) {
          //we judge if we will tranfer male and female number by the mode
          if (res.orderOrigins[0].mode == 0) {
            originorder['male'] = 0
            originorder['female'] = 0
            originorder['count'] = Math.ceil(res.orderOrigins[0].count * 1.05)
          } else {
            originorder['male'] = Math.ceil(res.orderOrigins[0].countMale * 1.05)
            originorder['female'] = Math.ceil((res.orderOrigins[0].count - res.orderOrigins[0].countMale) * 1.05)
            originorder['count'] = originorder['male'] + originorder['female']
          }
        } else {
          if (res.orderOrigins[0].mode == 0) {
            originorder['male'] = 0
            originorder['female'] = 0
            originorder['count'] = res.orderOrigins[0].count
          } else {
            originorder['male'] = res.orderOrigins[0].countMale
            originorder['female'] = res.orderOrigins[0].count - res.orderOrigins[0].countMale
            originorder['count'] = originorder['male'] + originorder['female']
          }
        }
      } else {
        if (res.orderOrigins[0].mode == 0) {
          originorder['male'] = 0
          originorder['female'] = 0
          originorder['count'] = res.orderOrigins[0].count
        } else {
          originorder['male'] = res.orderOrigins[0].countMale
          originorder['female'] = res.orderOrigins[0].count - res.orderOrigins[0].countMale
          originorder['count'] = originorder['male'] + originorder['female']
        }

      }

      var adviser = {}
      //we add retrieve adviserId here to implement more messsages such as phone and companyname
      var adviserId = res.orderOrigins[0].adviserId
      var users = await ctx.prismaHr.users({ where: { id: adviserId } })
      var profiles = await ctx.prismaHr.profiles({ where: { user: { id: users[0].id } } })
      adviser['name'] = users[0].name
      adviser['companyname'] = profiles[0].companyname
      adviser['phone'] = profiles[0].phone
      obj['modifiedorder'] = modifiedorder
      obj['originorder'] = originorder
      obj['adviser'] = adviser
      obj['state'] = res.orderOrigins[0].status - 1

      var pts = []
      // 查询当前已报名的男女人数
      // 调用queryPTOfOrder()接口查询，某个订单下已报名PT的总人数
      try {
        var request = new messages.QueryPTRequest();
        request.setOrderid(res.orderOrigins[0].id);
        request.setPtstatus(13);
        var response = await queryPt(request)
        obj['countyet'] = response.array[0].length
        if (obj['maleyet'] == undefined) { obj['maleyet'] = 0 }
        if (obj['femaleyet'] == undefined) { obj['femaleyet'] = 0 }
        for (var k = 0; k < obj['countyet']; k++) {
          var ptid = response.array[0][k][0]
          var personalmsgs = await ctx.prismaClient.personalmsgs({ where: { user: { id: ptid } } })
          // to judge if there is a male or female
          if (JSON.parse(personalmsgs[0].gender) == 1) {
            obj['maleyet'] = obj['maleyet'] + 1
          } else if (JSON.parse(personalmsgs[0].gender) == 2) {
            obj['femaleyet'] = obj['femaleyet'] + 1
          }
          var pt = {}
          pt['ptid'] = ptid
          pt['name'] = personalmsgs[0].name
          if (ptname != null && ptname != undefined && pt['name'].indexOf(ptname) == -1) { continue }
          pt['idnumber'] = personalmsgs[0].idnumber
          pt['gender'] = personalmsgs[0].gender
          pt['wechatname'] = "mocked wechat id"
          pt['phonenumber'] = personalmsgs[0].phonenumber
          var personalmsgs = await ctx.prismaClient.personalmsgs({ where: { user: { id: ptid } } })
          var personalmsg = personalmsgs[0]
          pt['height'] = personalmsgs[0].height
          pt['weight'] = personalmsgs[0].weight
          //here we retrieve ptorder state
          pt['ptorderstate'] = response.array[0][k][7]
          var contracts = await ctx.prismaHotel.contracts({ where: { AND: [{ orderid: res.orderOrigins[0].id }, { ptid: ptid }] } })
          if (contracts[0] != undefined) {
            pt['hash'] = contracts[0].hash
          }
          //here is worktimes and workhours
          var requestworktime = new messages.QueryExperienceRequest()
          requestworktime.setPtid(ptid)
          var responseworktime = await queryHistory(requestworktime)
          var resworktime = JSON.parse(responseworktime.array[0])
          pt['worktimes'] = resworktime.orderOrigins.length
          //here we calculate the hours in working
          var workhours = 0
          for (var p = 0; p < resworktime.orderOrigins.length; p++) {
            for (var q = 0; q < resworktime.orderOrigins[p].orderCandidates.length; q++) {
              if (resworktime.orderOrigins[p].orderCandidates[q].remark != null && resworktime.orderOrigins[p].orderCandidates[q].remark.ptId === ptid) {
                workhours = workhours + resworktime.orderOrigins[p].orderCandidates[q].remark.endDate - resworktime.orderOrigins[p].orderCandidates[q].remark.startDate
              }
            }
          }
          pt['workhours'] = Math.round(workhours / 3600)
          pts.push(pt)
        }
        obj['pt'] = pts
      }
      catch (error) {
        throw error
      }
      if (isModified === true) {
        orderList.unshift(obj)
      } else {
        orderList.push(obj)
      }
    }
    return orderList
  } catch (error) {
    throw error
  }
}


module.exports = { queryOrderOfAgent, queryPt, AgentGetOrderList, AgentSearchHistory }


