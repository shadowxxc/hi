'use strict';

const User = {
  name: 'User',
  primaryKey: 'username',
  properties: {
    username: 'string',
    name: 'string',
    tokenStr:'string',
    address: {type: 'string', optional: true},
    sign: {type: 'string', optional: true},
    sex: {type: 'int', optional: true},
    photo: {type: 'string', optional: true},
    department:{type: 'string', optional: true},
    cover:{type: 'string', optional: true},
    status:{type:'bool',default:true,optional:true}
  }
};

const ChatMessage  = {
  name:'ChatMessage ',
  properties:{
    id:'int',
    text:'string',
    createtime:'date',
    msgForm:'MyContacts',
    msgTo:'MyContacts',
    type:'string'
  }
}


const MyContacts = {
  name: 'MyContacts',
  properties: {
    username: 'string',
    name: 'string',
    photo: {type: 'string', optional: true},
    remark: {type: 'string', optional: true}, // 备注名
  }
};

/**
* 动态信息
*/
const Dynamic = {
  name: 'Dynamic',
  properties: {
    id: 'int',// 动态ID
    username: 'string', // 发表人
    name: 'string', // 发表人
    content: 'string',// 动态内容
    suports:  {type: 'data', optional: true},
    createtime: 'date',// 发表时间,
    photo: {type: 'string', optional: true},
    urls: {type: 'string', optional: true}
  }
};

/**
* 动态的评论信息
*/
const DynamicComment = {
  name: 'DynamicComment',
  properties: {
    id: 'int',// 评论ID
    publishid: 'string', // 动态ID
    username: 'string', // 评论用户ID
    name: 'string', // @用户ID
    content: 'string',// 评论内容
    commentTime: 'date',// 评论时间
    status: {type: 'string', optional: true}, // 状态
  }
};

/**
* 我的群组
*/
const MyGroup = {
  name: 'MyGroup',
  properties: {
    id: 'string', // ID
    groupId: 'string', // 群组ID
    joinTime: 'string', // 加入时间
    myRemarkInGroup: 'string', // 在群中我的备注
  }
};

var schema = [User,ChatMessage,MyContacts,Dynamic,DynamicComment,MyGroup];
module.exports = schema;

// {
//   schema: ,
//   schemaVersion:0,
//   migration: (oldRealm, newRealm) => {
//   }
// };
