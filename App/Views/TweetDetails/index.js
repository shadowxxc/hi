import React, {
    Component
} from 'react'

import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    AsyncStorage,
    TouchableHighlight
} from 'react-native'

import moment from 'moment'
import ParsedText from 'react-native-parsed-text'
import {getAvatarUrl} from '../../Utils'
import {ajax} from '../../Network'
import styleUtils from '../../Styles'
import icons from '../../assets/Icons.js'
import NavbarComp from '../../Components/NavBar'
import CommentComp from '../../Components/Comments'
const charFromUtf16 = utf16 => String.fromCodePoint(...utf16.split('-').map(u => '0x' + u))
import {connect} from "react-redux";
import {store} from '../../store'
import {gotoIndex} from '../../Components/goto'


class TweetDetailsView extends Component{
    constructor(props) {
        super(props)
        this.state = {
            loadding: true,
            comments: [],
            totoal:0,
            cs:[],
            suports:this.props.tweet.suports,
            flag:this.props.tweet.flag
        }

    }

    componentWillMount() {
        this.props.route.comment = this._comment.bind(this)
        this.props.route.callBackHome = this._callBackHome.bind(this)
    }

    componentDidMount() {
        ajax({
            url: 'CommentApi/getComments?publishId='+this.props.tweet.id,
            data:{
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'authorization':this.props.user.tokenStr
            },
            method:'POST'
        }).then(res => {
            console.log(res);
            if(!res.err_code) {
                this.setState({
                    loadding: false,
                    comments: res.obj.data,
                    totoal:res.obj.totoal
                })
            }
        })
    }

    render() {
      var xr_text = this.props.tweet.content;
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
      let con = this.state.suports;
      let xin = icons.xin;
      let suports = con.map((p, i) => {
        return (
          <View key={i} style={styles.suportsOne}>
              <Image source={{uri:xin}} style={styles.xinImg}></Image>
              <Text style={styles.xinname}>{p.username}</Text>
          </View>
        )
      })
      if(this.props.tweet.photo){
        var id = this.props.tweet.photo;
      }else{
        var id = 256;
      }
        return (
            <View style={[styles.container, styleUtils.containerShadow]}>
                <NavbarComp route={this.props.route} navigator={this.props.navigator}/>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={cardStyle.tweetContainer}>
                        <View style={cardStyle.topContainer}>
                            <Image source={{uri: 'http://192.168.10.58:9095/api/BaseApi/getImage?id='+id+'&w=&h='}} style={cardStyle.avatar} />
                            <View style={cardStyle.userContainer}>
                                <View >
                                    <View style={styles.nameAndZan}>
                                        <View style={styles.name}>
                                            <Text style={cardStyle.name}>{this.props.tweet.name}</Text>
                                        </View>
                                        <TouchableHighlight style={styles.bottomTool} onPress={this._onLike.bind(this,con)}  underlayColor='#fafafa'>
                                        <Image source={{uri: this.state.flag==true?icons.zanSelected:icons.zan}} style={styles.zan}></Image>
                                        </TouchableHighlight>
                                    </View>
                                    <Text style={cardStyle.time}>{'#' + this.props.tweet.id + ' '} {moment(this.props.tweet.createtime).fromNow()}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={cardStyle.middleContainer}>
                            <ParsedText
                                parse={
                                [{type: 'url', style: {color: '#007aff'}, onPress: this._handleUrlPress.bind(this)}]}
                            >{xr_text}</ParsedText>
                            {this._renderMsgImage(this.props.tweet)}
                        </View>
                    </View>

                    <View style={styles.suportsList}>
                    {suports}
                    </View>
                    <View style={styles.commentContainer}>
                        <View style={styles.commentTitle}>
                            <Text style={styles.commentTitleText}>评论{this.state.totoal}</Text>
                        </View>
                        <CommentComp loadding={this.state.loadding} comments={this.state.comments}/>
                    </View>
                </ScrollView>
            </View>
        )
    }

    _callBackHome(){
      var obj={
        id:this.props.tweet.id,
        flag:this.state.flag
      }
      this.props.route.callBack(obj);
      let that = this;
      setTimeout(function(){
        that.props.navigator.pop();
      },10)
    }

    _onLike(info){
      var timeline_bd = this.state.suports;
      if(this.state.flag==false){
          timeline_bd.push({username:this.props.user.username});
          this.setState({
            flag:true,
            suports:timeline_bd,
          })
          ajax({
              url: 'SupportApi/addSupport?publishId='+this.props.tweet.id+'&username='+this.props.user.username,
              data:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization':this.props.user.tokenStr
              },
              method:'POST'
          });
      }else{
          for(let j=0;j<timeline_bd.length;j++){
            if(timeline_bd[j].username==this.props.user.username){
              timeline_bd.splice(j,1);
              break;
            }
          }
          this.setState({
            flag:false,
            suports:timeline_bd,
          })
          ajax({
            url: 'SupportApi/cancleSupport?publishId='+this.props.tweet.id+'&username='+this.props.user.username,
            data:{
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'authorization':this.props.user.tokenStr
            },
            method:'POST'
          })
      }
      // console.log(timeline_bd);

  }

  _renderMsgImage(info) {
    console.log(info.urls);
      if(info.urls) {
          var arr_pic = info.urls.split(',');
          let pic = arr_pic.map((p, i) => {
            return (
              <TouchableHighlight key={i} onPress={this._openPhotoBrowser.bind(this, arr_pic,i)} style={cardStyle.imageTouch}>
                  <Image source={{uri: 'http://192.168.10.58:9095/api/BaseApi/getImage?id='+p+'&w=600&h=600'}} style={cardStyle.msgImage}  resizeMode= {Image.resizeMode.strech} />
              </TouchableHighlight>
            )
          })
          return (
              <View style={cardStyle.allImage}>
              {pic}
              </View>
          )
      }
  }

  _openPhotoBrowser(arr_pic,i){
    this.props.navigator.push({
        id: 'photoBrowser',
        params: {
            pic:arr_pic,
            index:i,
        }
    })
  }

    _handleUrlPress(url) {
        this.props.navigator.push({
            title: 'WebView',
            id: 'webview',
            params: {
                url: url
            }
        })
    }

    _comment() {
        this.props.navigator.push({
            title: '评论',
            id: 'comment',
            callBack: this._refreshView.bind(this)
        })
    }

//成功返回后的处理，可同时提交给后端
    _refreshView(info){
      var obj1 = {
        "name":this.props.user.name,
        "photo":this.props.user.photo,
        "content":info[1],

      }
      this.setState({
        comments:this.state.comments.concat(obj1),
        totoal:++this.state.totoal
      })
      ajax({
            url: 'CommentApi/addComment?publishId='+this.props.tweet.id+'&username='+info[0]+'&content='+info[1],
            data:{
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'authorization':this.props.user.tokenStr
            },
            method:'POST'
      })
    }




}

const cardStyle = styleUtils.card

const styles = StyleSheet.create({
    nameAndZan:{
      flexDirection:'row',
    },
    name:{
      flex:17,
    },
    bottomTool:{
      width:30,
      flex:1,
    },
    container: {
        ...styleUtils.containerBg,
        flexGrow: 1
    },
    zan:{
      width:30,
      height:30,
    },
    commentContainer: {
        borderWidth: 1,
        borderColor: '#ebe9e9',
        margin: 10,
        marginTop: 10
    },
    commentTitle: {
        height: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: '#ebe9e9'
    },
    commentTitleText: {
        fontSize: 12,
        color: '#6d6d72'
    },
    xinImg:{
      width:16,
      height:16,
      marginTop:6,
      marginRight:4
    },
    xinname: {
        color: '#598fb8',
    },
    suportsOne:{
      flexDirection: 'row',
      marginRight:10,
      paddingTop:6,
      paddingBottom:6,
      marginLeft:4,
    },
    suportsList:{
      backgroundColor:'#e0dddd',
      flexDirection: 'row',
      marginTop:10,
      marginLeft:12,
      marginRight:12,
    },
})

export default connect(
  (state) => (state)
)(TweetDetailsView)
