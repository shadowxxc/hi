import React from 'react'
import {
    Platform,
    StyleSheet,
    TouchableHighlight,
    Text,
    View,
    AsyncStorage,
    Alert,
    WebSocket
} from 'react-native'

import {ajax} from '../../Network'
import { GiftedChat, Actions, Bubble } from '../../Components/Chart'
import ImagePickerManager from 'react-native-image-picker';
import CustomActions from './customActions'
import CustomView from './customView'
import styleUtils from '../../Styles'
import NavbarComp from '../../Components/NavBar'
import iconfontConf from '../../Utils/iconfontConf';
import icons from '../../assets/Icons'
import {connect} from "react-redux";
import {store} from '../../store'
// import ws from '../../Components/ws.js'
var options = {
  storageOptions: {
    skipBackup: true,
    path: 'images',
    cameraRoll:true,
    selectedEmoji: null,
    showPicker: false,
  }
};
var timer;
class MessageView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            loadEarlier: true,
            typingText: null,
            isLoadingEarlier: false,
            myself_photo:''
        }

        this._isMounted = false
        this.onSend = this.onSend.bind(this)
        this.renderBubble = this.renderBubble.bind(this)
        this.renderFooter = this.renderFooter.bind(this)
        this.onLoadEarlier = this.onLoadEarlier.bind(this)

        this._isAlright = null;
        this.allMessage = [];
        var that = this;
        AsyncStorage.getItem(that.props.user.username+'&&'+that.props.nickname,(err,res)=>{
          if(res){
            var arr = JSON.parse(res)
            if(that.state.messages!=arr){
              that.allMessage =  arr;
              AsyncStorage.getItem('touxiangid',(err,res)=>{
                that.setState(() => {
                  return {
                    messages: arr,
                    myself_photo:res
                  }
                })
              })
            }
          }
        });
      }


    componentWillMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(timer);
    }
    componentDidMount(){
      var that = this;
      timer = setInterval(function(){
        AsyncStorage.getItem(that.props.user.username+'&&'+that.props.nickname,(err,res)=>{
          if(res){
            var arr = JSON.parse(res)
            if(that.state.messages!=arr){
              that.allMessage =  arr;
              that.setState(() => {
                return {
                  messages: arr,
                }
              })
            }
          }
        });
      },1000)
    }

    onLoadEarlier() {
        this.setState(previousState => {
            return {
                isLoadingEarlier: true,
            }
        })

        setTimeout(() => {
            if (this._isMounted === true) {
                this.setState(previousState => {
                    return {
                        messages: GiftedChat.prepend(previousState.messages, require('../../Mock/earlierMessage')),
                        loadEarlier: false,
                        isLoadingEarlier: false,
                    }
                })
            }
        }, 1000)
    }

    onSend(messages = []) {
        this.setState(previousState => {
            return {
                messages: GiftedChat.append(previousState.messages, messages),
            }
        })
        this.allMessage = messages.concat(this.allMessage)
        AsyncStorage.setItem(this.props.user.username+'&&'+this.props.nickname,JSON.stringify(this.allMessage));

        fetch('http://192.168.10.58:9095/api/MessageApi/sendMessage?msgFrom='+this.props.user.username+'&content='+messages[0].text+'&msgTo='+this.props.nickname,{
          method:'POST',
          headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization':this.props.user.tokenStr
          }
        })
    }

    getSelectedImages(){

    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: '#f0f0f0',
                    }
                }}
                />
        )
    }

    renderCustomView(props) {
        return (
            <CustomView
                {...props}
                />
        )
    }

    renderFooter(props) {
        if (this.state.typingText) {
            return (
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        {this.state.typingText}
                    </Text>
                </View>
            )
        }
    }

    _renderTool(tool, icon, theEnd) {
        return (
          <TouchableHighlight style={theEnd?styles.tool:styles.theEnd} onPress={this._onPressButton.bind(this,tool)} underlayColor='#e1e1e1'>
              <Text style={styles.toolText}>{iconfontConf(icon)}</Text>
          </TouchableHighlight>
        )
    }

    _getName(){

    }

    _onPressButton(tool){
      var title_tag;
      switch (tool) {
        case 'camera':
        ImagePickerManager.launchCamera(options, (response)  => {
          let source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
          if (Platform.OS === 'ios') {
            source = {uri: response.uri.replace('file://', ''), isStatic: true};
          } else {
            source = {uri: response.uri, isStatic: true};
          }
          // source = this.state.source.concat([source]);
          // this.uploadImage(response.uri);

          // this.setState({
          //   source:source,
          //   // pic_arr:this.state.pic_arr.concat([response.uri])
          // });
        });
        break;
        case 'album':
        ImagePickerManager.launchImageLibrary(options, (response)  => {
          let source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
          if (Platform.OS === 'ios') {
            source = {uri: response.uri.replace('file://', ''), isStatic: true};
          } else {
            source = {uri: response.uri, isStatic: true};
          }
          // source = this.state.source.concat([source]);
          //
          // this.uploadImage(response.uri);
          // this.setState({
          //   source:source,
          //   // pic_arr:this.state.pic_arr.concat([response.uri]),
          // });
        });
        break;
        case 'xia':
        this.setState({
          flag:true
        })
        case 'emotion':
        this.setState({showPicker: true})
        break;
        case 'at':
        this.props.navigator.push({
          title: '联系人',
          id: 'at',
          params:{
            user:this.props.user
          },
          callBack: this._getName.bind(this)
        })
        break;
        case 'location':
        break;
        default:
        break;
      }

    }

    render() {
      var bar = (
        <View style={styles.toolbar}>
            {this._renderTool('camera', 'uniE611',true)}
            {this._renderTool('album', 'uniE609',true)}
            {this._renderTool('emotion', 'uniE607',true)}
            {this._renderTool('at', 'uniE61A',true)}
        </View>
      )
        return (
            <View style={[styles.container, styleUtils.containerShadow]}>
                <NavbarComp route={this.props.route} navigator={this.props.navigator}/>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={this.onSend}
                    photoId ={this.props.userid}
                    myselfPhoto ={this.state.myself_photo}
                    user={{
                        _id: 1, // sent messages should have same user._id
                    }}
                    renderBubble={this.renderBubble}
                    renderCustomView={this.renderCustomView}
                    renderFooter={this.renderFooter}
                    />
                    {bar}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    add:{
      height:30,
      width:30,
    },
    container: {
        flexGrow: 1
    },
    footerContainer: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#aaa',
    },
    EmojiOverlay:{
      position:'absolute',
      top:200,
      height: 400,
      backgroundColor:'#fff'
    },
    imgtouch:{
      marginRight:5,
      marginLeft:10,
      marginBottom:-27,
    },
    uploadImage:{
      height:80,
      width:80,
    },
    textInput: {
      height: 160,
      backgroundColor: '#fff',
      padding: 10,
      paddingTop: 5,
      paddingBottom: 5,
      fontSize: 14,
      textAlignVertical: 'top'
    },
    toolbar: {
      flexDirection: 'row',
      flexWrap:'wrap',
    },
    tool: {
      flex:1,
      height: 40,
      margin:0,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 5,
      marginRight: 5
    },
    theEnd:{
      width: 30,
      height: 40,
      margin:0,
      alignItems: 'flex-end',
      justifyContent: 'center',
      right:10,
      position:'absolute'
    },
    toolText: {
      fontSize: 22,
      fontFamily: 'iconfont',
      color: '#666'
    },
})
export default connect(
  (state) => (state)
)(MessageView)
