import React, {
    Component
} from 'react'

import {
    StyleSheet,
    AsyncStorage,
    View
} from 'react-native'

import TabBarComp from '../../Components/TabBar'
import NavbarComp from '../../Components/NavBar'
import {connect} from "react-redux";
import {store} from '../../store'

class IndexView extends Component{
    constructor(props) {
        super(props);
        this.state = {}
        var that = this;
        var ws = new WebSocket('ws://192.168.10.58:9096/ws');

        ws.onopen = ()=>{
          ws.send('{"messageId":"12312","methodName":"longConn","arguments":["'+this.props.user.tokenStr+'"],"className":"LoginAction"}')
        }

        ws.onmessage = (e) => {
          var obj = JSON.parse(e.data);
          AsyncStorage.getItem(obj.msgTo+'&&'+obj.msgFrom,(err,res)=>{
              var arr_res = JSON.parse(res)
              var arr = [];
              arr[0]= {
                _id: Math.round(Math.random() * 1000000),
                text: obj.content,
                createdAt: new Date(),
                user: {
                  _id: 2,
                  name: 'React Native',
                  avatar: 'https://facebook.github.io/react/img/logo_og.png',
                },
              }
              if(!arr_res){
                arr_res=arr;
              }else{
                arr_res = arr.concat(arr_res)
              }
              AsyncStorage.setItem(obj.msgTo+'&&'+obj.msgFrom,JSON.stringify(arr_res))
          });


        };

        setInterval(function(){
          fetch('http://192.168.10.58:9095/api/UserApi/hreart?tokenStr='+that.props.user.tokenStr,{
            method:'POST',
            headers:{
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'authorization':that.props.user.tokenStr
            }
          })
        },60000)

    }

    render() {
        return (
            <View style={styles.container}>
                <NavbarComp route={this.props.route} navigator={this.props.navigator}/>
                <TabBarComp navigator={this.props.navigator}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1
    }
})

export default connect(
  (state) => (state)
)(IndexView)
