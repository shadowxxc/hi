import React, {
    Component
} from 'react'

import {
    StyleSheet,
    View,
    Alert,
    DeviceEventEmitter
} from 'react-native'

import styleUtils from '../../Styles'
import NavbarComp from '../../Components/NavBar'
import Editor from '../../Components/Editor'
import {connect} from "react-redux";
import {store} from '../../store'
import {gotoIndex} from '../../Components/goto'
const charFromUtf16 = utf16 => String.fromCodePoint(...utf16.split('-').map(u => '0x' + u))

class CommentView extends Component{
    constructor(props) {
        super(props)
        this.state = {
            text: '',
            arr_upload:[],
        }
    }

    componentWillMount() {
        this.props.route.sendComment = this.sendComment.bind(this)
    }

    componentDidMount(){
        DeviceEventEmitter.addListener('change',(emoji)=>{
          var start = this.state.text.length;
          let obj={
            start:start,
            end:start+2,
            emoji:emoji,
          }
          this.setState({
            text :this.state.text+charFromUtf16(emoji),
            arr_upload:this.state.arr_upload.concat([obj]),
          })
        })
        DeviceEventEmitter.addListener('atname',(name)=>{
          this.setState({
              text:this.state.text+'@'+name,
          })
        })
    }

    render() {
        return (
            <View style={[styles.container, styleUtils.containerShadow]}>
                <NavbarComp route={this.props.route} navigator={this.props.navigator}/>
                <Editor
                    enableTools={'emotion, at'}
                    onChangeText={this.onChangeText.bind(this)}
                    placeholder={'我也说一句...'}
                    text={this.state.text}
                    user={this.props.user}
                    navigator={this.props.navigator}
                    />
            </View>
        )
    }

    sendComment() {
        var arr_upload = this.state.arr_upload;
        let upload_text='';
        if(arr_upload.length!=0){
          var text =this.state.text;
          let arr=[];
          let start =0;
          let end;
          for(var i =0;i<arr_upload.length;i++){
            if(i!=0){
              start = arr_upload[i-1].end;
            }
            end = arr_upload[i].start;
            arr[i] = text.slice(start,end);
            upload_text+=arr[i]+arr_upload[i].emoji;
            console.log(arr[i]);
          }
          arr[i] = text.slice(arr_upload[i-1].end);
          upload_text+=arr[i];
        }else{
          upload_text=this.state.text;
        }
        var obj = [this.props.user.username,upload_text]
        this.props.route.callBack(obj);
        this.props.navigator.pop()

    }

    onChangeText(text) {
        var arr_upload = this.state.arr_upload
        for(var i=arr_upload.length-1;i>=0;i--){
          if(text.length<arr_upload[i].end){
            arr_upload.splice(i,1);
          }else{
            break;
          }
        }
        this.setState({
            text: text
        })
    }
}

const styles = StyleSheet.create({
    container: {
        ...styleUtils.containerBg,
        flexGrow: 1
    }
})

export default connect(
  (state) => (state)
)(CommentView)
