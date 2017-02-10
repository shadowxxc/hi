import React, {
    Component
} from 'react'

import {
    StyleSheet,
    View,
    Image,
    Text,
    AsyncStorage,
    TouchableHighlight
} from 'react-native'

import capitalize from 'lodash/capitalize'

import ItemCell from '../../Components/ItemCell'
import styleUtils from '../../Styles'
import {connect} from "react-redux";
import {store} from '../../store'
import {gotoUser} from '../../Components/goto'

class SettingsView extends Component {
    constructor(props) {
        super(props);
        this.state={
          flag:false,
          id:259,
          img:{}
        }
        fetch('http://192.168.10.58:9095/api/UserApi/getUser?tokenStr='+this.props.user.tokenStr,{
          method:'POST',
          headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization':this.props.user.tokenStr
          }
        })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
            if(!res.err_code) {
              if(res.obj.photo){
                var id=res.obj.photo
              }
              this.setState({
                id:id,
              })
            }
        })
    }



    render() {
      if(!this.state.flag){
        var img =(
          <Image source={{uri:'http://192.168.10.58:9095/api/BaseApi/getImage?id='+this.state.id+'&w=&h='}} style={Styles.avatar} />
        )
      }else{
        var img =(
          <Image source={this.state.img} style={Styles.avatar} />
        )
      }

        return (
            <View>
                <TouchableHighlight underlayColor='transparent' onPress={gotoUser.bind(this,this.props.user)}>
                    <View style={Styles.tweetContainer}>
                        {img}
                        <View style={Styles.rightContainer}>
                            <View style={Styles.userContainer}>
                                <Text style={Styles.name}>用户名: {this.props.user.username}</Text>
                            </View>
                            <Text style={[Styles.time, Styles.ponit]}>金币: 100</Text>
                        </View>
                    </View>
                </TouchableHighlight>
                <ItemCell
                    onPress={this._gotoView.bind(this, 'feedback','意见反馈')}
                    showDisclosureIndicator={true}
                    showBottomBorder={false}
                    iconStyle={itemCellColor.feedbackIcon}
                    containerStyle={itemCellColor.container}
                    icon={require('../../assets/feedback.png')}
                    id='setting'
                    >
                    反馈
                </ItemCell>
                <ItemCell
                    onPress={this._gotoView.bind(this,'about', '关于')}
                    showDisclosureIndicator={true}
                    showBottomBorder={false}
                    iconStyle={itemCellColor.aboutIcon}
                    containerStyle={itemCellColor.container}
                    icon={require('../../assets/about.png')}
                    id='setting'
                    >
                    关于
                </ItemCell>
                <TouchableHighlight onPress={this._loginOut.bind(this)} style={Styles.viewCommit} underlayColor='#ff9630'>
                    <Text style={{color:'#fff'}}>
                       退出
                    </Text>
                </TouchableHighlight>
            </View>
        )
    }

    _changeUser(){

    }

    changed(text){
      this.setState({
        img:text,
        flag:true
      })
    }



    _loginOut(){
      AsyncStorage.setItem('user',this.props.user.username);
      fetch('http://192.168.10.58:9095/api/LoginAction/loginOut?tokenStr='+this.props.user.tokenStr);
      this.props.navigator.push({
          id: 'login',
          params:{
            user:{
              username:this.props.user.username
            }
          }
      })
    }

    _gotoView(id,view) {
        this.props.navigator.push({
            title: view,
            id: id
        })
    }
}

const itemCellColor = {
    container: styleUtils.itemCell,
    feedbackIcon: {
        backgroundColor: '#38b57f'
    },
    languageIcon: {
        backgroundColor: '#9b59b6'
    },
    aboutIcon: {
        backgroundColor: '#5999f3'
    }
}

const Styles = StyleSheet.create({
    tweetContainer: {
        ...styleUtils.itemCell,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingTop: 4,
        paddingBottom: 10,
        marginTop:10,
        marginBottom:10,
    },
    viewCommit:{
      marginTop:20,
      marginLeft:10,
      marginRight:10,
      backgroundColor:'#ff9630',
      height:40,
      borderRadius:5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatar: {
        backgroundColor: 'gray',
        width: 50,
        height: 50,
        marginLeft: 10,
        borderRadius: 4
    },
    userContainer: {
        flexDirection: 'row'
    },
    time: {
        marginLeft: 4,
        fontSize: 13,
        color: '#8999a5',
        marginTop: 2
    },
    name: {
        fontWeight: '600',
        fontSize: 15
    },
    rightContainer: {
        flexGrow: 1,
        padding: 10
    },
    ponit: {
        marginLeft: 0
    },
    logoutButton: {
        backgroundColor: '#ff3b30',
        borderWidth: 0,
        margin: 10,
        marginTop: 20
    },
    logoutButtonFontsize: {
        fontSize: 18,
        color: 'white'
    }
})

export default connect(
  (state) => (state)
)(SettingsView)
