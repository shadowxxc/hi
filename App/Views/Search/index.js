import React, {
    Component
} from 'react';

import {
    StyleSheet,
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableHighlight,
    ListView,
    Image
} from 'react-native';

import {ajax} from '../../Network'
var that;
export default class SearchView extends Component{
    constructor(props) {
        super(props);
        that=this;
        this.state = {
            text: '',
            contacts:[],
            btnText:'取消'
        }
    }

    render() {
      console.log(this.props.route.navigator);
      let con = this.state.contacts;
      let concacts = con.map((p, i) => {
        return (
          <TouchableHighlight key={i}
              underlayColor='#D9D9D9'
              style={Styles.container}
              onPress={this._gotoMessageView.bind(that,{nickename: p.name})}>
              <View style={Styles.viewContainer}>
                  <View style={Styles.leftContainer}>
                      <Image source={require('../../assets/head.jpg')} style={Styles.image}></Image>
                  </View>
                  <View style={Styles.textContainer}>
                          <Text style={Styles.text}>
                              {p.name}
                          </Text>
                  </View>
              </View>
          </TouchableHighlight>
        )
      })
        return (
          <View style={Styles.bg}>
            <View style={Styles.flex}>
              <TextInput style={Styles.input} placeholder='请输入关键字...'  underlineColorAndroid = "transparent"
                    onChangeText={this._textChange.bind(this)}  value={this.state.text}/>
              <TouchableHighlight style={Styles.btn} onPress={this._onclickBtn.bind(this)} underlayColor='#efeff4' >
                  <Text style={Styles.btnText}>{this.state.btnText}</Text>
              </TouchableHighlight>
            </View>
            <ScrollView>
            {concacts}
            </ScrollView>
          </View>
        )

    }

    _gotoMessageView(params) {
        this.props.navigator.push({
            title: params.nickename,
            id: 'message',
            params: params
        })
    }

    _onclickBtn(){
      if(this.state.btnText=='取消'){
        this.props.navigator.pop();
      }else{
        ajax({
            url: 'UserApi/getUsers?keyword='+this.state.text,
            data:{
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'authorization':this.props.route.params.user.tokenStr
            },
            method:'POST'
        }).then(res => {
            if (!res.err_code) {
              let content=this._changeObj(res.obj);
                this.setState({
                  contacts:content,
                  btnText:'取消'
                });
            }
        })
      }
    }

    _textChange(text){
      this.setState({
        text:text,
        btnText:'确定'
      })

    }

    _changeObj(obj){
      let arrFromObj = [];
      for(var key in obj){
          console.log("属性：" + key + ",值："+ obj[key][0].name);
          if(key!='ok'){
            arrFromObj=arrFromObj.concat(obj[key]);
            console.log(arrFromObj[0].name);
          }
      }
      return arrFromObj;
    }

}

const Styles = StyleSheet.create({
  image:{
    width:30,
    height:30,
    marginLeft:10,
  },
  container: {
      flexGrow: 1,
      flexDirection: 'row',
      marginTop:4,
  },
  viewContainer: {
      flexGrow: 1,
      flexDirection: 'row',
      backgroundColor: 'white',
      alignItems: 'center',
  },
  leftContainer: {
      marginTop: 5,
      marginBottom: 5,
  },
  flex: {
      flexGrow: 1
  },
  bottomBorder: { // eslint-disable-line
      // borderBottomWidth: 1 / PixelRatio.get(),
      borderBottomColor: '#C8C7CC',
      borderStyle: 'solid',
  },
  paddingView: {
      width: 15,
      backgroundColor: 'white',
  },
  textContainer: {
      flexGrow: 1,
      flexDirection: 'row',
      marginTop: 10,
      marginBottom: 10,
      marginLeft:15,
      alignItems: 'center',
  },
  text: {
      flexGrow: 1,
      fontSize: 16,
      alignSelf: 'center',
  },
  subText: {
      marginRight: 5,
      fontSize: 14,
      color: '#8e8e93'
  },
  chevron: {
      width: 23,
      height: 23,
      marginRight: 5
  },
  iconContainer: {
      alignItems: 'center',
      width: 30,
      height: 30,
      justifyContent: 'center',
      marginRight: 10,
      marginLeft: 10
  },
  icon: {
      width: 24,
      height: 24
  },
    flex:{
      flexDirection: 'row',
      marginTop:14,
      marginLeft:10,
    },
    input:{
      height:40,
      flex:7,
      backgroundColor:'#fff',
      borderRadius:10
    },
    btn:{
      flex:1,
      marginTop:10,
      marginBottom:4,
    },
    btnText:{
      lineHeight:20,
      textAlign:'center',
    },
    bg:{
      backgroundColor:'#efeff4',
      flex:1,
    }
})
