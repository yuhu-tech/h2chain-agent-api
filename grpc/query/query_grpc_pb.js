// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var query_pb = require('./query_pb.js');

function serialize_QueryAgentReply(arg) {
  if (!(arg instanceof query_pb.QueryAgentReply)) {
    throw new Error('Expected argument of type QueryAgentReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_QueryAgentReply(buffer_arg) {
  return query_pb.QueryAgentReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_QueryAgentRequest(arg) {
  if (!(arg instanceof query_pb.QueryAgentRequest)) {
    throw new Error('Expected argument of type QueryAgentRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_QueryAgentRequest(buffer_arg) {
  return query_pb.QueryAgentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_QueryExperienceReply(arg) {
  if (!(arg instanceof query_pb.QueryExperienceReply)) {
    throw new Error('Expected argument of type QueryExperienceReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_QueryExperienceReply(buffer_arg) {
  return query_pb.QueryExperienceReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_QueryExperienceRequest(arg) {
  if (!(arg instanceof query_pb.QueryExperienceRequest)) {
    throw new Error('Expected argument of type QueryExperienceRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_QueryExperienceRequest(buffer_arg) {
  return query_pb.QueryExperienceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_QueryOOAReply(arg) {
  if (!(arg instanceof query_pb.QueryOOAReply)) {
    throw new Error('Expected argument of type QueryOOAReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_QueryOOAReply(buffer_arg) {
  return query_pb.QueryOOAReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_QueryOOARequest(arg) {
  if (!(arg instanceof query_pb.QueryOOARequest)) {
    throw new Error('Expected argument of type QueryOOARequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_QueryOOARequest(buffer_arg) {
  return query_pb.QueryOOARequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_QueryPTReply(arg) {
  if (!(arg instanceof query_pb.QueryPTReply)) {
    throw new Error('Expected argument of type QueryPTReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_QueryPTReply(buffer_arg) {
  return query_pb.QueryPTReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_QueryPTRequest(arg) {
  if (!(arg instanceof query_pb.QueryPTRequest)) {
    throw new Error('Expected argument of type QueryPTRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_QueryPTRequest(buffer_arg) {
  return query_pb.QueryPTRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_QueryRemarkReply(arg) {
  if (!(arg instanceof query_pb.QueryRemarkReply)) {
    throw new Error('Expected argument of type QueryRemarkReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_QueryRemarkReply(buffer_arg) {
  return query_pb.QueryRemarkReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_QueryRemarkRequest(arg) {
  if (!(arg instanceof query_pb.QueryRemarkRequest)) {
    throw new Error('Expected argument of type QueryRemarkRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_QueryRemarkRequest(buffer_arg) {
  return query_pb.QueryRemarkRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_QueryReply(arg) {
  if (!(arg instanceof query_pb.QueryReply)) {
    throw new Error('Expected argument of type QueryReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_QueryReply(buffer_arg) {
  return query_pb.QueryReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_QueryRequest(arg) {
  if (!(arg instanceof query_pb.QueryRequest)) {
    throw new Error('Expected argument of type QueryRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_QueryRequest(buffer_arg) {
  return query_pb.QueryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var QueryOrderService = exports.QueryOrderService = {
  // hotel/adviser/pt query order
  queryOrder: {
    path: '/QueryOrder/QueryOrder',
    requestStream: false,
    responseStream: false,
    requestType: query_pb.QueryRequest,
    responseType: query_pb.QueryReply,
    requestSerialize: serialize_QueryRequest,
    requestDeserialize: deserialize_QueryRequest,
    responseSerialize: serialize_QueryReply,
    responseDeserialize: deserialize_QueryReply,
  },
  // hotel/adviser query order's pt
  queryPTOfOrder: {
    path: '/QueryOrder/QueryPTOfOrder',
    requestStream: false,
    responseStream: false,
    requestType: query_pb.QueryPTRequest,
    responseType: query_pb.QueryPTReply,
    requestSerialize: serialize_QueryPTRequest,
    requestDeserialize: deserialize_QueryPTRequest,
    responseSerialize: serialize_QueryPTReply,
    responseDeserialize: deserialize_QueryPTReply,
  },
  // adviser query pt's remark
  queryRemark: {
    path: '/QueryOrder/QueryRemark',
    requestStream: false,
    responseStream: false,
    requestType: query_pb.QueryRemarkRequest,
    responseType: query_pb.QueryRemarkReply,
    requestSerialize: serialize_QueryRemarkRequest,
    requestDeserialize: deserialize_QueryRemarkRequest,
    responseSerialize: serialize_QueryRemarkReply,
    responseDeserialize: deserialize_QueryRemarkReply,
  },
  // adviser query pt' work experience
  queryExperience: {
    path: '/QueryOrder/QueryExperience',
    requestStream: false,
    responseStream: false,
    requestType: query_pb.QueryExperienceRequest,
    responseType: query_pb.QueryExperienceReply,
    requestSerialize: serialize_QueryExperienceRequest,
    requestDeserialize: deserialize_QueryExperienceRequest,
    responseSerialize: serialize_QueryExperienceReply,
    responseDeserialize: deserialize_QueryExperienceReply,
  },
  // adviser query agent list of order
  queryAgentOfOrder: {
    path: '/QueryOrder/QueryAgentOfOrder',
    requestStream: false,
    responseStream: false,
    requestType: query_pb.QueryAgentRequest,
    responseType: query_pb.QueryAgentReply,
    requestSerialize: serialize_QueryAgentRequest,
    requestDeserialize: deserialize_QueryAgentRequest,
    responseSerialize: serialize_QueryAgentReply,
    responseDeserialize: deserialize_QueryAgentReply,
  },
  // agent query order
  queryOrderOfAgent: {
    path: '/QueryOrder/QueryOrderOfAgent',
    requestStream: false,
    responseStream: false,
    requestType: query_pb.QueryOOARequest,
    responseType: query_pb.QueryOOAReply,
    requestSerialize: serialize_QueryOOARequest,
    requestDeserialize: deserialize_QueryOOARequest,
    responseSerialize: serialize_QueryOOAReply,
    responseDeserialize: deserialize_QueryOOAReply,
  },
};

exports.QueryOrderClient = grpc.makeGenericClientConstructor(QueryOrderService);
