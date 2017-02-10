import React, {
    Component
} from 'react'

import {
    StyleSheet,
    View,
    Alert,
    TextInput,
    AsyncStorage,
    DeviceEventEmitter
} from 'react-native'

import styleUtils from '../../Styles'
import NavbarComp from '../../Components/NavBar'
import {ajax} from '../../Network'
import {connect} from "react-redux";
import {store} from '../../store'
import {updateName} from '../../actions/userMyself'


class NameView extends Component{
    constructor(props) {
        super(props)
        this.state = {
            text: this.props.user.name,
        }
    }
    componentWillMount() {
        this.props.route.sendTweet = this.sendTweet.bind(this)
    }

    render() {
        return (
            <View style={styles.container}>
                <NavbarComp route={this.props.route} navigator={this.props.navigator} flag={true}/>
                <TextInput
                    style={styles.textInput}
                    numberOfLines={1}
                    autoFocus={false}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(text) => {
                        this.setState({
                          text:text
                        })
                    }}
                    value={this.state.text}
                    />
            </View>
        )
    }

    sendTweet(){
      var text = this.state.text;
      if(text){
        fetch('http://192.168.10.58:9095/api/UserApi/updateUser?username='+this.props.route.username+'&filedKey=name&filedValue='+text,{
          method:'POST',
          headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization':this.props.user.tokenStr
          }
        })
        .then((res) => res.json())
        .then((res) => {
        })
        this.props.navigator.pop();
        store.dispatch(updateName(text));
      }else if(text==this.props.user.name){
        this.props.navigator.pop();
      }else{
        Alert.alert(
            '提示',
            "姓名不能为空哦......",
            [
                {text: '确定'}
            ]
        )
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
export default connect(
  (state) => (state)
)(NameView)
