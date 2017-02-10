'use strict';

export function gotoLogin(navigator,res=''){
  navigator.replace({
    id: 'login',
    params:{
      user:{
        username:res
      }
    }
  })
}

export function gotoIndex(navigator){
  navigator.replace({
    id: 'index',
    index:0,
    name:'indexView',
  })
}

export function gotoWebView(navigator,url){
  navigator.push({
      title: 'WebView',
      id: 'webview',
      params: {
          url: url
      }
  })
}

export function gotoDetails(that,tweet){
  that.props.navigator.push({
      title: '详情',
      id: 'tweetDetails',
      params: {
          tweet: tweet,
      },
       callBack: that._zanRefreshView.bind(that),
  })
}

export function gotoMessage(navigator,contact){
  navigator.push({
      title: contact.name,
      id: 'message',
      params: {
        nickname:contact.username,
        userid:contact.photo
      }
  })
}

export function gotoUser(user){
  this.props.navigator.push({
      id: 'user',
      title:'个人信息',
      params:{
        user:user,
      },
      callBack: this.changed.bind(this)
  })
}

export function gotoChangeName(){
  this.props.navigator.push({
    id:'name',
    title:'修改姓名',
  })
}
