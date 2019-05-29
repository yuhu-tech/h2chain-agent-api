// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var mutation_pb = require('./mutation_pb.js');

function serialize_CleanReply(arg) {
  if (!(arg instanceof mutation_pb.CleanReply)) {
    throw new Error('Expected argument of type CleanReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_CleanReply(buffer_arg) {
  return mutation_pb.CleanReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_CleanRequest(arg) {
  if (!(arg instanceof mutation_pb.CleanRequest)) {
    throw new Error('Expected argument of type CleanRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_CleanRequest(buffer_arg) {
  return mutation_pb.CleanRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_CloseReply(arg) {
  if (!(arg instanceof mutation_pb.CloseReply)) {
    throw new Error('Expected argument of type CloseReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_CloseReply(buffer_arg) {
  return mutation_pb.CloseReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_CloseRequest(arg) {
  if (!(arg instanceof mutation_pb.CloseRequest)) {
    throw new Error('Expected argument of type CloseRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_CloseRequest(buffer_arg) {
  return mutation_pb.CloseRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_CreateReply(arg) {
  if (!(arg instanceof mutation_pb.CreateReply)) {
    throw new Error('Expected argument of type CreateReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_CreateReply(buffer_arg) {
  return mutation_pb.CreateReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_CreateRequest(arg) {
  if (!(arg instanceof mutation_pb.CreateRequest)) {
    throw new Error('Expected argument of type CreateRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_CreateRequest(buffer_arg) {
  return mutation_pb.CreateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_EditReply(arg) {
  if (!(arg instanceof mutation_pb.EditReply)) {
    throw new Error('Expected argument of type EditReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_EditReply(buffer_arg) {
  return mutation_pb.EditReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_EditRequest(arg) {
  if (!(arg instanceof mutation_pb.EditRequest)) {
    throw new Error('Expected argument of type EditRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_EditRequest(buffer_arg) {
  return mutation_pb.EditRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ModifyPtReply(arg) {
  if (!(arg instanceof mutation_pb.ModifyPtReply)) {
    throw new Error('Expected argument of type ModifyPtReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_ModifyPtReply(buffer_arg) {
  return mutation_pb.ModifyPtReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ModifyPtRequest(arg) {
  if (!(arg instanceof mutation_pb.ModifyPtRequest)) {
    throw new Error('Expected argument of type ModifyPtRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_ModifyPtRequest(buffer_arg) {
  return mutation_pb.ModifyPtRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ModifyReply(arg) {
  if (!(arg instanceof mutation_pb.ModifyReply)) {
    throw new Error('Expected argument of type ModifyReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_ModifyReply(buffer_arg) {
  return mutation_pb.ModifyReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ModifyRequest(arg) {
  if (!(arg instanceof mutation_pb.ModifyRequest)) {
    throw new Error('Expected argument of type ModifyRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_ModifyRequest(buffer_arg) {
  return mutation_pb.ModifyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_PostReply(arg) {
  if (!(arg instanceof mutation_pb.PostReply)) {
    throw new Error('Expected argument of type PostReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_PostReply(buffer_arg) {
  return mutation_pb.PostReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_PostRequest(arg) {
  if (!(arg instanceof mutation_pb.PostRequest)) {
    throw new Error('Expected argument of type PostRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_PostRequest(buffer_arg) {
  return mutation_pb.PostRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_RegistryReply(arg) {
  if (!(arg instanceof mutation_pb.RegistryReply)) {
    throw new Error('Expected argument of type RegistryReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_RegistryReply(buffer_arg) {
  return mutation_pb.RegistryReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_RegistryRequest(arg) {
  if (!(arg instanceof mutation_pb.RegistryRequest)) {
    throw new Error('Expected argument of type RegistryRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_RegistryRequest(buffer_arg) {
  return mutation_pb.RegistryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var MutationService = exports.MutationService = {
  // create order
  createOrder: {
    path: '/Mutation/CreateOrder',
    requestStream: false,
    responseStream: false,
    requestType: mutation_pb.CreateRequest,
    responseType: mutation_pb.CreateReply,
    requestSerialize: serialize_CreateRequest,
    requestDeserialize: deserialize_CreateRequest,
    responseSerialize: serialize_CreateReply,
    responseDeserialize: deserialize_CreateReply,
  },
  // post order
  postOrder: {
    path: '/Mutation/PostOrder',
    requestStream: false,
    responseStream: false,
    requestType: mutation_pb.PostRequest,
    responseType: mutation_pb.PostReply,
    requestSerialize: serialize_PostRequest,
    requestDeserialize: deserialize_PostRequest,
    responseSerialize: serialize_PostReply,
    responseDeserialize: deserialize_PostReply,
  },
  // register order
  registryOrder: {
    path: '/Mutation/RegistryOrder',
    requestStream: false,
    responseStream: false,
    requestType: mutation_pb.RegistryRequest,
    responseType: mutation_pb.RegistryReply,
    requestSerialize: serialize_RegistryRequest,
    requestDeserialize: deserialize_RegistryRequest,
    responseSerialize: serialize_RegistryReply,
    responseDeserialize: deserialize_RegistryReply,
  },
  // modify order
  modifyOrder: {
    path: '/Mutation/ModifyOrder',
    requestStream: false,
    responseStream: false,
    requestType: mutation_pb.ModifyRequest,
    responseType: mutation_pb.ModifyReply,
    requestSerialize: serialize_ModifyRequest,
    requestDeserialize: deserialize_ModifyRequest,
    responseSerialize: serialize_ModifyReply,
    responseDeserialize: deserialize_ModifyReply,
  },
  // modify order's pt
  modifyPTOfOrder: {
    path: '/Mutation/ModifyPTOfOrder',
    requestStream: false,
    responseStream: false,
    requestType: mutation_pb.ModifyPtRequest,
    responseType: mutation_pb.ModifyPtReply,
    requestSerialize: serialize_ModifyPtRequest,
    requestDeserialize: deserialize_ModifyPtRequest,
    responseSerialize: serialize_ModifyPtReply,
    responseDeserialize: deserialize_ModifyPtReply,
  },
  // close order
  closeOrder: {
    path: '/Mutation/CloseOrder',
    requestStream: false,
    responseStream: false,
    requestType: mutation_pb.CloseRequest,
    responseType: mutation_pb.CloseReply,
    requestSerialize: serialize_CloseRequest,
    requestDeserialize: deserialize_CloseRequest,
    responseSerialize: serialize_CloseReply,
    responseDeserialize: deserialize_CloseReply,
  },
  // edit order's pt remark
  editRemark: {
    path: '/Mutation/EditRemark',
    requestStream: false,
    responseStream: false,
    requestType: mutation_pb.EditRequest,
    responseType: mutation_pb.EditReply,
    requestSerialize: serialize_EditRequest,
    requestDeserialize: deserialize_EditRequest,
    responseSerialize: serialize_EditReply,
    responseDeserialize: deserialize_EditReply,
  },
  // clean order
  cleanOrder: {
    path: '/Mutation/CleanOrder',
    requestStream: false,
    responseStream: false,
    requestType: mutation_pb.CleanRequest,
    responseType: mutation_pb.CleanReply,
    requestSerialize: serialize_CleanRequest,
    requestDeserialize: deserialize_CleanRequest,
    responseSerialize: serialize_CleanReply,
    responseDeserialize: deserialize_CleanReply,
  },
};

exports.MutationClient = grpc.makeGenericClientConstructor(MutationService);
