import React, {
  Component
} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ToastAndroid,
  TouchableHighlight,
  ListView,
  ScrollView,
  Alert,
  AsyncStorage,
  Image
} from 'react-native';

import {ajax} from '../../Network'
import {connect} from "react-redux";
import {store} from '../../store'
import {setUsername,setTokenStr,updateName,updatePhoto} from '../../actions/userMyself'
const dismissKeyboard = require('dismissKeyboard');
import openRealm from '../../Realm/open';
// import Realm from 'realm'
// import schema from '../../Realm/schema-v1'

class LoginView extends Component{
  constructor(props) {
    super(props);
    this.state = {
      username:this.props.route.params.user.username,
      password:'',
    }
  }

  render() {
    return (
      <View style={{backgroundColor:'#f4f4f4',flex:1}}>
          <Image
              style={styles.image}
              resizeMode="contain"
              source={require('../../assets/logo.jpg')}/>
          <TextInput
              style={styles.userInput}
              placeholder='用户名/邮箱'
              numberOfLines={1}
              autoFocus={false}
              underlineColorAndroid={'transparent'}
              textAlign='center'
              value={this.state.username}
              onChangeText={(text) => {
                  this.setState({
                    username:text
                  })
              }}
          />
          <View
             style={{height:1,backgroundColor:'#f4f4f4'}}
          />
          <TextInput
              style={styles.pwdInput}
              placeholder='密码'
              numberOfLines={1}
              underlineColorAndroid={'transparent'}
              secureTextEntry={true}
              textAlign='center'
              onChangeText={(text) => {
                  this.setState({
                    password:text
                  })
              }}
          />
            <TouchableHighlight onPress={this._callbackLogin.bind(this)} style={styles.viewCommit} underlayColor='#ff9630'>
                <Text style={{color:'#fff'}}>
                   登录
                </Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={this._gotoRegister.bind(this)} style={styles.btnTouch} underlayColor='#f4f4f4'>
                <Text style={styles.viewRegister}>
                     注册>>
                </Text>
            </TouchableHighlight>
      </View>
    )
  }

  _callbackLogin(){
    dismissKeyboard();
    fetch('http://192.168.10.58:9095/api/LoginAction/login?username='+this.state.username+'&password='+this.state.password)
    .then((res) => res.json())
    .then((res) => {
        if(!res.err_code) {
          if(res.ok){
            var str = this.state.username+'&&%%&&'+res.obj;
            store.dispatch(setTokenStr(res.obj));
            store.dispatch(setUsername(this.state.username));
            AsyncStorage.setItem('user',str)
            var tokenStr=res.obj;
            openRealm(res.obj);
            // fetch('http://192.168.10.58:9095/api/UserApi/getUser?tokenStr='+tokenStr,{
            //   method:'POST',
            //   headers:{
            //     'Accept': 'application/json',
            //     'Content-Type': 'application/json',
            //     'authorization':tokenStr
            //   }
            // })
            // .then((res) => res.json())
            // .then((res) => {
            //     if(!res.err_code) {
            //       var path = res.obj.username+'.realm';
            //       realm = new Realm({
            //         path: path,
            //         schema: schema,
            //         schemaVersion:6,
            //       });
            //       let Users = realm.objects('User');
            //       let myself = Users.filtered('username="'+res.obj.username+'"');
            //       if(!myself){
            //         realm.write(()=> {
            //           realm.create('User', {
            //             username: res.obj.username,
            //             name: res.obj.name,
            //             tokenStr:tokenStr
            //           });
            //         })
            //       }else{
            //
            //       }
            //       store.dispatch(updateName(res.obj.name));
            //       if(res.obj.photo){
            //         store.dispatch(updatePhoto(res.obj.photo));
            //       }
            //     }
            // })
            this._login(res.obj);
          }else{
            Alert.alert(
                '提示',
                "用户名或密码有误，请重新输入......",
                [
                    {text: '确定'}
                ]
            )
          }
        }
    })
  }

  _login(res){
      this.props.navigator.push({
        id: 'index',
        index:0,
        name:'indexView',
        // params:{
        //   user:{
        //     username:this.state.username,
        //     tokenStr:res
        //   }
        // }
      })
  }

  _gotoRegister(){
    this.props.navigator.push({
      id: 'register',
    })
  }

}


const styles =StyleSheet.create({
  btnTouch:{
    marginRight:20,
    marginTop:20,
  },
  image:{
    borderRadius:80,
    height:80,
    width:80,
    marginTop:70,
    alignSelf:'center',
  },
  userInput:{
    backgroundColor:'#fff',
    marginTop:20,
    height:40,
  },
  pwdInput:{
    backgroundColor:'#fff',
    height:40,
  },
  viewCommit:{
    marginTop:15,
    marginLeft:10,
    marginRight:10,
    backgroundColor:'#ff9630',
    height:35,
    borderRadius:5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewRegister:{
    fontSize:12,
    color:'#ff9630',
    textAlign:'right',
  }
});

export default connect(
  (state) => (state)
)(LoginView)
