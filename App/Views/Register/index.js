import React, {
    Component
} from 'react';

import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableHighlight,
    ListView,
    Alert,
    AsyncStorage,
    ScrollView,
    Image
} from 'react-native';

import {ajax} from '../../Network'

export default class RegisterView extends Component{
  constructor(props) {
      super(props);
      this.state = {
        username:'',
        password:'',
        name:'',
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
                placeholder='*用户名(必填)'
                numberOfLines={1}
                underlineColorAndroid={'transparent'}
                onChangeText={(text) => {
                    this.setState({
                      username:text
                    })
                }}
                textAlign='center'
            />
            <View
               style={{height:1,backgroundColor:'#f4f4f4'}}
            />
            <TextInput
                style={styles.pwdInput}
                placeholder='*密码    (必填)'
                numberOfLines={1}
                underlineColorAndroid={'transparent'}
                onChangeText={(text) => {
                    this.setState({
                      password:text
                    })
                }}
                secureTextEntry={true}
                textAlign='center'
            />
            <View
               style={{height:1,backgroundColor:'#f4f4f4'}}
            />
            <TextInput
                style={styles.pwdInput}
                placeholder='*姓名    (必填)'
                numberOfLines={1}
                underlineColorAndroid={'transparent'}
                onChangeText={(text) => {
                    this.setState({
                      name:text
                    })
                }}
                textAlign='center'
            />
            <View
               style={{height:1,backgroundColor:'#f4f4f4'}}
            />
            <TextInput
                style={styles.pwdInput}
                placeholder='联系人  (选填)'
                numberOfLines={1}
                underlineColorAndroid={'transparent'}
                onChangeText={(text) => {
                    this.setState({
                      contact:text
                    })
                }}
                textAlign='center'
                keyboardType='numeric'
            />

              <TouchableHighlight onPress={this._gotoIndex.bind(this)} style={styles.viewCommit} underlayColor='#ff9630'>
                  <Text style={{color:'#fff'}}>
                     注册
                  </Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={this._gotoLogin.bind(this)} style={styles.btnTouch} underlayColor='#f4f4f4'>
                  <Text style={styles.viewRegister}>
                       已有账号?
                  </Text>
              </TouchableHighlight>
        </View>
      )

  }

  _gotoLogin(){
      this.props.navigator.pop();
  }

  _gotoIndex(){
    var concat=this.state.concat?this.state.concat:null
    if(this.state.username==''){
      Alert.alert(
          '提示',
          "用户名不能为空....",
          [
              {text: '确定'}
          ]
      )
    }else if(this.state.password==''){
      Alert.alert(
          '提示',
          "密码不能为空.....",
          [
              {text: '确定'}
          ]
      )
    }else if(this.state.name==''){
      Alert.alert(
          '提示',
          "姓名不能为空.....",
          [
              {text: '确定'}
          ]
      )
    }else{
      fetch('http://192.168.10.58:9095/api/LoginAction/register?username='+this.state.username+'&password='+this.state.password+'&name='+this.state.name+'&concat='+concat)
      .then((res) => res.json())
      .then((res) => {
          if(!res.err_code) {
            AsyncStorage.setItem('name_myself',this.state.name);
            if(res.ok){
              fetch('http://192.168.10.58:9095/api/LoginAction/login?username='+this.state.username+'&password='+this.state.password)
              .then((res) => res.json())
              .then((res) => {
                  if(!res.err_code) {
                    if(res.ok){
                      var str = this.state.username+'&&%%&&'+res.obj;
                      AsyncStorage.setItem('user',str)
                        this.props.navigator.push({
                            id: 'index',
                            index:0,
                            name:'indexView',
                            params:{
                              user:{
                                username:this.state.username,
                                tokenStr:res.obj
                              }
                            }
                        })
                    }
                  }
              })
            }else{
              Alert.alert(
                  '提示',
                  "很遗憾，注册失败了......",
                  [
                      {text: '确定'}
                  ]
              )
            }
          }
      })

    }
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
    // textAlign:'right',
  }
});
