import React from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    AsyncStorage,
    Alert,
} from 'react-native'

import {ajax} from '../../Network'
import { GiftedChat, Actions, Bubble } from '../../Components/Chart'
// import { GiftedChat, Actions, Bubble } from 'react-native-gifted-chat'
import ImagePickerManager from 'react-native-image-picker';
import CustomActions from './customActions'
import CustomView from './customView'
import styleUtils from '../../Styles'
import NavbarComp from '../../Components/NavBar'
import icons from '../../assets/Icons'
import iconfontConf from '../../Utils/iconfontConf';
var options = {
  storageOptions: {
    skipBackup: true,
    path: 'images',
    cameraRoll:true,
    selectedEmoji: null,
    showPicker: false,

  }
};
var that;
export default class MessageView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            messages: [],
            typingText: null,
            isLoadingEarlier: false,
            flag:false,
            bottom:true,
        }
        that = this;
        this._isMounted = false
        this.onSend = this.onSend.bind(this)
        this.onReceive = this.onReceive.bind(this)
        this.renderCustomActions = this.renderCustomActions.bind(this)
        this.renderBubble = this.renderBubble.bind(this)
        this.renderFooter = this.renderFooter.bind(this)
        // this.onLoadEarlier = this.onLoadEarlier.bind(this)
        this._isAlright = null
        this.allMessage = [];
        AsyncStorage.getItem(this.props.route.params.user.username+'&&'+this.props.route.params.nickname,(err,res)=>{
          console.log(res);
          if(res){
            var arr = JSON.parse(res)
            this.allMessage =  arr;
            this.setState(() => {
              return {
                messages: arr.reverse(),
              }
            })
            // setInterval(()=>{
            // that.onReceive();
            // },3000)
          }
        });

    }

    componentWillMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    //
    // onLoadEarlier() {
    //     this.setState(previousState => {
    //         return {
    //             isLoadingEarlier: true,
    //         }
    //     })
    //
    //     setTimeout(() => {
    //         if (this._isMounted === true) {
    //             this.setState(previousState => {
    //                 return {
    //                     messages: GiftedChat.prepend(previousState.messages, require('../../Mock/earlierMessage')),
    //                     loadEarlier: false,
    //                     isLoadingEarlier: false,
    //                 }
    //             })
    //         }
    //     }, 1000) // simulating network
    // }

    onSend(messages = []) {
        this.setState(previousState => {
            return {
                messages: GiftedChat.append(previousState.messages, messages),
            }
        })
        console.log(messages);
        console.log(this.state.messages);
        this.allMessage = this.allMessage.concat(messages)
        AsyncStorage.setItem(this.props.route.params.user.username+'&&'+this.props.route.params.nickname,JSON.stringify(this.allMessage));
        ajax({
            url: 'MessageApi/sendMessage?msgFrom ='+this.props.route.params.user.username+'&content='+messages.text+'&msgTo='+this.props.route.params.nickname,
            data:{
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'authorization':this.props.route.params.user.tokenStr
            },
            method:'POST'
        });
        this.onReceive(messages)
    }

// //自动回复
//     answerDemo(messages) {
//         if (messages.length > 0) {
//             if ((messages[0].image || messages[0].location) || !this._isAlright) {
//                 this.setState(previousState => {
//                     return {
//                         typingText: 'React Native is typing'
//                     }
//                 })
//             }
//         }
//         setTimeout(() => {
//             if (this._isMounted === true) {
//                 if (messages.length > 0) {
//                     if (messages[0].image) {
//                         this.onReceive('Nice picture!')
//                     } else if (messages[0].location) {
//                         this.onReceive('My favorite place')
//                     } else {
//                         if (!this._isAlright) {
//                             this._isAlright = true
//                             this.onReceive('Alright')
//                         }
//                     }
//                 }
//             }
//
//             this.setState(previousState => {
//                 return {
//                     typingText: null,
//                 }
//             })
//         }, 1000)
//     }

    onReceive(messages) {
        // ajax({
        //     url: 'MessageApi/getMessage?userid'+this.props.userid,
        //     data:{
        //       'Accept': 'application/json',
        //       'Content-Type': 'application/json',
        //       'authorization':this.props.route.params.user.tokenStr
        //     },
        //     method:'POST'
        // }).then((res)=>{
        //   console.log(res);
        //   if(res.length){
            // this.setState(previousState => {
            //   return {
            //     messages: GiftedChat.append(previousState.messages, {
            //       text: text,
            //       // text: res[0].content,
            //       createdAt: new Date(),
            //       user: {
            //         _id: 2,
            //         name: 'React Native',
            //         avatar: 'https://facebook.github.io/react/img/logo_og.png',
            //       },
            //     }),
            //   }
            // })
        //   }
        // })
        // messages.user._id=2;
        this.setState(previousState => {
            return {
                messages: GiftedChat.append(previousState.messages, {
                      text: 'text',
                      // text: res[0].content,
                      createdAt: new Date(),
                      user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://facebook.github.io/react/img/logo_og.png',
                      },
                    }),
            }
        })
    }

    getSelectedImages(){

    }

    renderCustomActions(props) {
      // this.setState({
      //   bottom:false,
      // })
        return (
          <TouchableHighlight style={styles.tool} onPress={this._onPressModel.bind(this)} underlayColor='#fff'>
            <Image
              source={{uri:icons.add}}
              style={styles.add}
              />
          </TouchableHighlight>
        )
    }

    _onPressModel(){
      this.setState({
        bottom:!this.state.bottom,
        flag:!this.state.flag,
        messages:this.state.messages,
      })
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

    // _renderDialog(){
    //
    // }

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
                user={{
                  _id: 1,
                }}
                flag = {this.state.bottom}
                renderBubble={this.renderBubble}
                renderFooter={this.renderFooter}
                />
                {bar}
            </View>
        )
    }

    _renderTool(tool, icon, theEnd) {
        return (
          <TouchableHighlight style={theEnd?styles.tool:styles.theEnd} onPress={this._onPressButton.bind(this,tool)} underlayColor='#e1e1e1'>
          <Text style={styles.toolText}>{iconfontConf(icon)}</Text>
          </TouchableHighlight>
        )
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
                console.log(response);
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
                console.log(response);
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
