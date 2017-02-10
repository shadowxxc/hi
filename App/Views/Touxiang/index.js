import React, {
  Component
} from 'react'

import {
  StyleSheet,
  View,
  Alert,
  TextInput,
  AsyncStorage,
  Image,
  Platform,
  DeviceEventEmitter
} from 'react-native'

import styleUtils from '../../Styles'
import NavbarComp from '../../Components/NavBar'
import {ajax} from '../../Network'
import ImagePickerManager from 'react-native-image-picker';
var options = {
  storageOptions: {
    skipBackup: true,
    path: 'images',
    cameraRoll:true,
    selectedEmoji: null,
    showPicker: false,
  }
};

export default class TouxiangView extends Component{
  constructor(props) {
    super(props)
    this.state = {
      flag:false,
      img:{},
    }
  }
  componentWillMount() {
    this.props.route.sendTweet = this.sendTweet.bind(this)
    this.props.route.sendTweet2 = this.sendTweet2.bind(this)
  }

  render() {
    if(!this.state.flag){
      return (
        <View style={styles.container}>
          <NavbarComp route={this.props.route} navigator={this.props.navigator} flag={true}/>
          <Image
          style={styles.img}
          source={{uri: 'http://192.168.10.58:9095/api/BaseApi/getImage?id='+this.props.route.params.id+'&w=&h='}}
          />
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <NavbarComp route={this.props.route} navigator={this.props.navigator} flag={true}/>
        <View style={styles.ot}>
          <Image
            resizeMode='stretch'
            style={styles.img}
            source={this.state.img}
          />
        </View>
      </View>
    )
  }

  uploadImage(uri,source){
    let formData = new FormData();
    var file = {uri: uri, type: 'multipart/form-data', name: 'a.jpg'};
    formData.append("filename",file);
    let url = 'http://192.168.10.58:9095/api/BaseApi/upload'
    fetch(url,{
      method:'POST',
      headers:{
        'Content-Type':'multipart/form-data',
        'authorization':this.props.route.params.user.tokenStr
      },
      body:formData,
    })
    .then((response) => response.json() )
    .then((responseData)=>{
      fetch('http://192.168.10.58:9095/api/UserApi/updateUser?username='+this.props.route.params.user.username+'&filedKey=photo&filedValue='+responseData.obj,{
        method:'POST',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'authorization':this.props.route.params.user.tokenStr
        }
      });
      AsyncStorage.setItem('touxiangid',responseData.obj);
    })
  }

  sendTweet2(){
    if(this.state.flag){
      this.props.route.callBack("touxiang",this.state.img);
    }
    this.props.navigator.pop();
  }


  sendTweet(){
    ImagePickerManager.launchImageLibrary(options, (response)  => {
      let source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
      if (Platform.OS === 'ios') {
        source = {uri: response.uri.replace('file://', ''), isStatic: true};
      } else {
        source = {uri: response.uri, isStatic: true};
      }
      if(source.uri){
        this.setState({
          img:source,
          flag:true,
        })
        this.uploadImage(response.uri,source);
      }
    });
  }

}

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#000',
    flexDirection:'column',
    flex:1,

  },
  ot:{
    flex:1,
  },
  img:{
    flex:1,
    marginVertical :100,
  }
})
