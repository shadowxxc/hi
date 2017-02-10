import React, {
    Component
} from 'react'

import {
    StyleSheet,
    View,
    Alert,
    TextInput,
    DeviceEventEmitter
} from 'react-native'

import styleUtils from '../../Styles'
import NavbarComp from '../../Components/NavBar'
import {ajax} from '../../Network'
import Editor from '../../Components/Editor'


export default class AddressView extends Component{
    constructor(props) {
        super(props)
        this.state = {
            text: this.props.route.params.add,
        }
    }
    componentWillMount() {
        this.props.route.sendTweet = this.sendTweet.bind(this)
    }

    render() {
        return (
            <View style={styles.container}>
                <NavbarComp route={this.props.route} navigator={this.props.navigator} flag={true}/>
                <Editor
                    enableTools={''}
                    onChangeText={(text) => {
                      this.setState({
                        text:text
                      })
                    }}
                    placeholder={'我也说一句...'}
                    text={this.state.text}
                    />
            </View>
        )
    }

    sendTweet(){
      var text = this.state.text;
      if(this.props.route.title=='我的地址'){
        var filedKey='address';
      }else{
        var filedKey='sign';
      }
      if(text!=this.props.route.params.add){
        fetch('http://192.168.10.58:9095/api/UserApi/updateUser?username='+this.props.route.params.user.username+'&filedKey='+filedKey+'&filedValue='+text,{
          method:'POST',
          headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization':this.props.route.params.user.tokenStr
          }
        })
        .then((res) => res.json())
        .then((res) => {
            if(!res.err_code) {
              if(this.props.route.title=='我的地址'){
                this.props.route.callBack('address',text);
              }else{
                this.props.route.callBack('person',text);
              }
              this.props.navigator.pop();
            }
        })
      }else{
        this.props.navigator.pop();         
      }
    }

}

const styles = StyleSheet.create({
  textInput:{
    backgroundColor:'#fff',
    height:40,
    fontSize:16,
  }
})
