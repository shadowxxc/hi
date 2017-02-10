import React, {
    Component
} from 'react'

import {
    StyleSheet,
    View,
    Image,
    TouchableHighlight,
    Platform,
    Text
} from 'react-native'

// JavaScript 日期处理类库
import moment from 'moment'
import GiftedListView from '../../Components/GiftListView'
import ParsedText from 'react-native-parsed-text'
import {ajax} from '../../Network'
import styleUtils from '../../Styles'
import {getAvatarUrl} from '../../Utils'
import icons from '../../assets/Icons.js'
import {connect} from "react-redux";
import {store} from '../../store'
import {gotoWebView,gotoDetails} from '../../Components/goto'

var that;
var arrFlag=[];
const charFromUtf16 = utf16 => String.fromCodePoint(...utf16.split('-').map(u => '0x' + u))

class HomeView extends Component {
    constructor(props) {
        super(props)
        that = this;
        this.state = {
            like:0,
            timeline: [],
            cs:'aaa',
            startId:1,
            length:0,
            time:1,
        }
    }

    render() {
        let color = Platform.OS === 'android' ? styleUtils.androidSpinnerColor : 'gray';
        return (
          <View>
            <GiftedListView
                ref="lala"
                enableEmptySections={true}
                customStyles={customStyles}
                rowView={this._renderRowView.bind(this)}
                onFetch={this._onFetch.bind(this)}
                firstLoader={true}
                pagination={true}
                refreshable={true}
                withSections={false}
                spinnerColor={color}
            />
          </View>
        )
    }

    _onFetch(page = 1, callback, options,flag) {
        if(page === 1 && options.firstLoad) {
          ajax({
            url: 'PublishApi/getPublishs?id=&nav=1&size=8&username='+this.props.user.username,
            data:{
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'authorization':this.props.user.tokenStr
            },
            method:'POST'
          }).then(res => {
            if(!res.err_code) {
              this.setState({
                timeline: res.obj,
                startId:res.obj[0].id,
                length:res.obj.length,
              })
              callback(this.state.timeline)
            }
          })
        }
        else if(page === 1&&!options.firstLoad&&flag==false) {
          var old = this.state.timeline;
          ajax({
            url: 'PublishApi/getPublishs?id='+old[0].id+'&nav=1&d=1000&username='+this.props.user.username,
            data:{
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'authorization':this.props.user.tokenStr
            },
            method:'POST'
          }).then(res => {
            if(!res.err_code) {
              this.setState({
                timeline: res.obj.reverse().concat(old),
                length:old.length+res.obj.length,
              })
              this.setState({
                startId:this.state.timeline[0].id,
              })
              callback(this.state.timeline)
            }
          })
        }
        else if(page === 2&&options.firstLoad&&flag==false) {
          ajax({
            url: 'PublishApi/getPublishs?id='+(this.state.startId+1)+'&nav=0&size='+this.state.length+'&username='+this.props.user.username,
            data:{
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'authorization':this.props.user.tokenStr
            },
            method:'POST'
          }).then(res => {
            if(!res.err_code) {
              this.setState({
                timeline: res.obj,
              })
              callback(this.state.timeline)
            }
          })
        }
        else {
          let len = this.state.length+8;
          ajax({
            url: 'PublishApi/getPublishs?id='+(this.state.startId+1)+'&nav=0&size='+len+'&username='+this.props.user.username,
            data:{
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'authorization':this.props.user.tokenStr
            },
            method:'POST'
          }).then(res => {
            if(!res.err_code) {
              if(this.state.endId<=9) {
                callback(res.obj, {
                  allLoaded: true
                })
              }else{
                this.setState({
                  timeline: res.obj,
                  length:len,
                })
                callback(this.state.timeline);
              }
            }
          })
        }
    }


    _renderRowView(info,sectionID,rowID) {
      if(info.photo){
        var id = info.photo;
      }else{
        var id = 256;
      }
      var xr_text = info.content;
      for(var i=0;i<xr_text.length;i++){
        let text1 = xr_text.slice(i,i+3);
        let text2= xr_text.slice(i,i+4);
        let text3= xr_text.slice(i,i+5);
        if(text1=='1F6'||text1=='1F4'||text1=='1F3'||text2=='263A'||text2=='270B'||text2=='270C'){
          var arr = xr_text.split(text3);
          xr_text = arr[0];
          for(var j =1;j<arr.length;j++){
            xr_text += charFromUtf16(text3)+arr[j];
          }
        }
      }
      let con = info.suports;
      let xin = icons.xin;
      let suports = con.map((p, i) => {
        return (
          <View key={i} style={styles.suportsOne}>
              <Image source={{uri:xin}} style={styles.xinImg}></Image>
              <Text style={styles.xinname}>{p.username}</Text>
          </View>
        )
      })
        return (
            <TouchableHighlight underlayColor='transparent' onPress={this._gotoDetails.bind(this, info)} style={styles.item}>
                <View style={styles.tweetContainer}>
                    <View style={styles.topContainer}>
                            <Image source={{uri: 'http://192.168.10.58:9095/api/BaseApi/getImage?id='+id+'&w=&h='}} style={styles.avatar} />
                            <View style={styles.userContainer}>
                                <Text style={styles.name}>{info.name}</Text>
                                <Text style={styles.time}>{'#' + info.id + ' '} {moment(info.createtime).fromNow()}</Text>
                            </View>
                    </View>
                    <View style={styles.middleContainer}>
                        <ParsedText
                            parse={
                            [{type: 'url', style: customStyles.url, onPress: this._handleUrlPress.bind(this)}]}
                        >{xr_text}</ParsedText>
                        {this._renderMsgImage(info)}
                    </View>
                    <View style={styles.bottomContainer}>
                        <TouchableHighlight style={styles.bottomTool} onPress={this._onLike.bind(this,info)}  underlayColor='#fafafa'>
                            <Image source={{uri: info.flag==true ? icons.zanSelected: icons.zan}} style={styles.zan}></Image>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.bottomTool} onPress={this._gotoDetails.bind(this, info)}  underlayColor='#fafafa'>
                            <Text style={styles.bottomToolText}>查看评论</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.bottomTool} onPress={this._gotoTweet.bind(this, info)}  underlayColor='#fafafa'>
                            <Text style={styles.bottomToolText}>转发</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.suportsList}>
                    {suports}
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    _onLike(info){

      if(info.flag==false){
          ajax({
              url: 'SupportApi/addSupport?publishId='+info.id+'&username='+this.props.user.username,
              data:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization':this.props.user.tokenStr
              },
              method:'POST'
          });
      }else{
          ajax({
            url: 'SupportApi/cancleSupport?publishId='+info.id+'&username='+this.props.user.username,
            data:{
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'authorization':this.props.user.tokenStr
            },
            method:'POST'
          })
      }
      this._onFetch(2,this.refs.lala._postRefresh, {firstLoad:true},false)
  }
  //
  // _onLike(info){
  //   arrFlag[info.id] = !arrFlag[info.id];
  //   var timeline_bd = this.state.timeline;
  //   for(var i=0;i<timeline_bd.length;i++){
  //     if(timeline_bd[i].id==info.id){
  //       break;
  //     }
  //   }
  //   if(info.flag==false){
  //       info.flag = true;
  //       timeline_bd[i].flag = true;
  //       timeline_bd[i].suports.push({username:'chenxx'});
  //       ajax({
  //           url: 'SupportApi/addSupport?publishId='+info.id+'&userName=chenxx'
  //       });
  //
  //   }else{
  //     info.flag = false;
  //       timeline_bd[i].flag = false;
  //       for(let j=0;j<timeline_bd[i].suports.length;j++){
  //         if(timeline_bd[i].suports[j].username=='chenxx'){
  //           timeline_bd[i].suports.splice(j,1);
  //           break;
  //         }
  //       }
  //       ajax({
  //         url: 'SupportApi/cancleSupport?publishId='+info.id+'&username=chenxx'
  //       })
  //   }

    // this._renderRowView(info,"s1",i)
    // this.refs.lala._updateRows(timeline_bd);
//     this.setState({
//       timeline:timeline_bd,
//     })
// }
    _renderMsgImage(info) {
        if(info.urls) {
            var arr_pic = info.urls.split(',');
            let pic = arr_pic.map((p, i) => {
              return (
                <TouchableHighlight key={i} onPress={this._openPhotoBrowser.bind(this, arr_pic,i)} style={styles.imageTouch}>
                    <Image source={{uri: 'http://192.168.10.58:9095/api/BaseApi/getImage?id='+p+'&w=600&h=600'}} style={styles.msgImage}  resizeMode= {Image.resizeMode.stretch} />
                </TouchableHighlight>
              )
            })
            return (
                <View style={styles.allImage}>
                {pic}
                </View>
            )
        }
    }


    _handleUrlPress(url) {
      gotoWebView(this.props.navigator,url);
    }

    _gotoDetails(tweet) {
        gotoDetails(this,tweet)
    }

    _zanRefreshView(obj){
      arrFlag[obj.id]=obj.flag;
      this._onFetch(2,this.refs.lala._postRefresh, {firstLoad:true},false)
    }



    _gotoTweet(info){
      this.props.navigator.push({
          title: '转发',
          id: 'tweet',
          component:'TweetView',
          params: {
            text:info.content,
            image:info.urls,
            user:this.props.user,
          },
         callBack: this._refreshView
      })
    }

    _refreshView(info){
      that.setState({
        cs:info
      })
    }

    _openPhotoBrowser(arr_pic,i) {
        this.props.navigator.push({
            id: 'photoBrowser',
            params: {
                pic:arr_pic,
                index:i,
            }
        })
    }
}

const customStyles = {
    paginationView: {
        ...styleUtils.containerBg
    },
    url: {
        color: '#007aff'
    }
}

const styles = StyleSheet.create(styleUtils.card)

export default connect(
  (state) => (state)
)(HomeView)
