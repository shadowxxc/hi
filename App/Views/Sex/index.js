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
import ItemCell from '../../Components/ItemCell'


export default class SexView extends Component{
    constructor(props) {
        super(props)
        if(this.props.route.params.sex=='男'){
          var flag=0;
        }else{
          var flag=1;
        }
        this.state = {
            flag:flag,
        }
    }
    componentWillMount() {
        this.props.route.sendTweet = this.sendTweet.bind(this)
    }

    render() {
        return (
            <View style={styles.container}>
                <NavbarComp route={this.props.route} navigator={this.props.navigator} flag={true}/>
                <ItemCell
                onPress={this._choose.bind(this,0)}
                showBottomBorder={false}
                selected={!this.state.flag}>
                男
                </ItemCell>
                <ItemCell
                onPress={this._choose.bind(this,1)}
                showBottomBorder={false}
                selected={this.state.flag}>
                女
                </ItemCell>
            </View>
        )
    }

    _choose(flag){
      if(flag!=this.state.flag){
        if(flag==0){
          this.setState({
            flag:0,
          })
          var text = '男';
        }else{
          this.setState({
            flag:1,
          })
          var text = '女';
        }
        fetch('http://192.168.10.58:9095/api/UserApi/updateUser?username='+this.props.route.params.user.username+'&filedKey=sex&filedValue='+flag,{
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
            this.props.route.callBack("sex",text);
            this.props.navigator.pop();
          }
        })
      }

    }

    sendTweet(){
      this.props.navigator.pop();
    }

}

const styles = StyleSheet.create({
  textInput:{
    backgroundColor:'#fff',
    height:40,
    fontSize:16,
  }
})
