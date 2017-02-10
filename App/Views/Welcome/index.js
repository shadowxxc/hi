import React, {
  Component
} from 'react';

import {
  StyleSheet,
  View,
  AsyncStorage,
  ToastAndroid,
  Image
} from 'react-native';

import {connect} from "react-redux";
import {store} from '../../store'
import {setUsername,setTokenStr} from '../../actions/userMyself'
import {gotoLogin,gotoIndex} from '../../Components/goto'
import openRealm from '../../Realm/open';

class WelcomeView extends Component{
  constructor(props) {
    super(props);
  }

  render() {
      return (
        <View style={{backgroundColor:'#f4f4f4',flex:1}}>
        <Image
          style={styles.image}
          source={require('../../assets/welcome.png')}/>
        </View>
      )

  }

  componentDidMount(){
    AsyncStorage.getItem("user",(err,res)=>{
      if(res){
        let tokenStr = res.split('&&%%&&');
        if(tokenStr.length==2){
          store.dispatch(setUsername(tokenStr[0]));
          store.dispatch(setTokenStr(tokenStr[1]));
          openRealm(tokenStr[1]);
          gotoIndex(this.props.navigator);
        }else{
          gotoLogin(this.props.navigator,res);
        }
      }else{
        gotoLogin(this.props.navigator);
      }
    });
  }
}


const styles =StyleSheet.create({
  image:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    width:null,
    height:null,
  }
});

export default connect(
  (state) => (state)
)(WelcomeView)
