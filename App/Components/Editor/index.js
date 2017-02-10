import React, {
  Component,
  PropTypes
} from 'react'

import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  NativeModules,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  DeviceEventEmitter
} from 'react-native'


import { EmojiOverlay } from '../EmojiPicker';
import ImagePickerManager from 'react-native-image-picker';
import iconfontConf from '../../Utils/iconfontConf';
import {connect} from "react-redux";
import {store} from '../../store'
// import {setUsername,setTokenStr,updateName,updatePhoto} from '../../actions/userMyself'

var that;
var options = {
  storageOptions: {
    skipBackup: true,
    path: 'images',
    cameraRoll:true,
    selectedEmoji: null,
    showPicker: false,
  }
};
class EditorComp extends Component {
  constructor(props) {
    super(props);
    // if(this.props.image){
    //   x=this.props.image.split(',');
    // }
    this.state = {
      cs:111,
      flag:true,
      source:[],
      // res:'',
      flag:[],
      pic_arr:[],
    }
    that = this;
  }

  render() {
    if(this.state.flag&&this.props.image){
      var startImage = this.props.image.split(',');
      var upImage = startImage.map((p, i) => {
        return (
          <TouchableHighlight key={i}
          underlayColor='#fafafa'
          style={styles.imgtouch}>
          <Image source={{uri:'http://192.168.10.58:9095/api/BaseApi/getImage?id='+p+'&w=800&h=800'}} style={styles.uploadImage} />
          </TouchableHighlight>
        )
      })
    }
    var con = this.state.source;
    var uploadImage = con.map((p, i) => {
      return (
        <TouchableHighlight key={i}
        underlayColor='#fafafa'
        style={styles.imgtouch}>
        <Image source={p} style={styles.uploadImage} />
        </TouchableHighlight>
      )
    })

    return (
      <View>
          <ScrollView>
              <TextInput
                  placeholder={this.props.placeholder}
                  multiline={true}
                  style={styles.textInput}
                  value={this.props.text}
                  onChangeText={this.props.onChangeText}
                  />
              <View style={styles.toolbar}>
                  {this._renderTool('camera', 'uniE611')}
                  {this._renderTool('album', 'uniE609')}
                  {this._renderTool('emotion', 'uniE607')}
                  {this._renderTool('at', 'uniE61A')}
              </View>
          </ScrollView>
          <View style={styles.toolbar}>
              {upImage}
              {uploadImage}
          </View>
          <EmojiOverlay
              style={styles.EmojiOverlay}
              horizontal={true}
              visible={this.state.showPicker}
              onEmojiSelected={this._emojiSelected.bind(this)}
              onTapOutside={() => this.setState({showPicker: false})} />
      </View>
    )
  }
  // {this._renderTool('location', 'uniE61B')}
  _emojiSelected = emoji => {
    DeviceEventEmitter.emit('change',emoji);
    this.setState({
      showPicker: false,
    });
  }

  uploadImage(uri){
    var res = '';
    var flag = this.state.flag;
    var i = flag.length;
    flag[i]= false;
    this.setState({
      flag:flag,
    })
    DeviceEventEmitter.emit('flag',flag);
    let formData = new FormData();
    var file = {uri: uri, type: 'multipart/form-data', name: 'a.jpg'};
    formData.append("filename",file);
    let url = 'http://192.168.10.58:9095/api/BaseApi/upload'
    fetch(url,{
      method:'POST',
      headers:{
        'Content-Type':'multipart/form-data',
        'authorization':this.props.user.tokenStr
      },
      body:formData,
    })
    .then((response) => response.json() )
    .then((responseData)=>{
      console.log(responseData.obj);
      flag[i]=true;
      this.setState({
        flag:flag,
      })
      DeviceEventEmitter.emit('flag',flag);
      DeviceEventEmitter.emit('picchange',responseData.obj);
    })
  }

  _renderTool(tool, icon, handle = () => {}) {
    if(this._enableTool(tool)) {
      return (
        <TouchableHighlight style={styles.tool} onPress={this._onPressButton.bind(this,tool)} underlayColor='#e1e1e1'>
        <Text style={styles.toolText}>{iconfontConf(icon)}</Text>
        </TouchableHighlight>
      )
    }
  }

  _getName(name){
    DeviceEventEmitter.emit('atname',name);
  }

  _enableTool(tool) {
    let list = this.props.enableTools
    return ~list.trim().indexOf(tool)
  }

  _onPressButton(tool){
    var title_tag;
    switch (tool) {
      case 'camera':
      ImagePickerManager.launchCamera(options, (response)  => {
        let source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        if (Platform.OS === 'ios') {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        } else {
          source = {uri: response.uri, isStatic: true};
          console.log(response);
        }
        console.log(source);
        if(source.uri){
          source = this.state.source.concat([source]);
          this.uploadImage(response.uri);
          this.setState({
            source:source,
          });
        }
      });
      break;
      case 'album':
      ImagePickerManager.launchImageLibrary(options, (response)  => {
        let source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        if (Platform.OS === 'ios') {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        } else {
          source = {uri: response.uri, isStatic: true};
          console.log(response);
        }
        if(source.uri){
          source = this.state.source.concat([source]);

          this.uploadImage(response.uri);
          this.setState({
            source:source,
            // pic_arr:this.state.pic_arr.concat([response.uri]),
          });
        }
      });
      break;
      case 'emotion':
      this.setState({showPicker: true})
      break;
      case 'at':
      this.props.navigator.push({
        title: '联系人',
        id: 'at',
        params:{
          user:this.props.user
        },
        callBack: this._getName.bind(this)
      })
      break;
      case 'location':

      break;
      default:
      break;
    }

  }

}

EditorComp.propTypes = {
  enableTools: PropTypes.string,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  onChangeText: PropTypes.func
}

EditorComp.defaultProps = {
  enableTools: 'camera, album, emotion, at, location'
}

const styles = StyleSheet.create({
  EmojiOverlay:{
    position:'absolute',
    top:200,
    height: 400,
    backgroundColor:'#fff'
  },
  imgtouch:{
    marginRight:5,
    marginLeft:10,
    marginBottom:-27,
  },
  uploadImage:{
    height:80,
    width:80,
  },
  textInput: {
    height: 160,
    backgroundColor: '#fff',
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 14,
    textAlignVertical: 'top'
  },
  toolbar: {
    flexDirection: 'row',
    flexWrap:'wrap',
  },
  tool: {
    width: 50,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    marginRight: 5
  },
  toolText: {
    fontSize: 22,
    fontFamily: 'iconfont',
    color: '#666'
  }
})

export default connect(
  (state) => (state)
)(EditorComp)
