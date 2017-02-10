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
import {ajax} from '../../Network'
import {connect} from "react-redux";
import {store} from '../../store'
const charFromUtf16 = utf16 => String.fromCodePoint(...utf16.split('-').map(u => '0x' + u))

class TweetView extends Component{
    constructor(props) {
        super(props)
        var state_text = '';
        var pic_Id = '';
        if(this.props.route.params){
          state_text = this.props.route.params.text;
          if(this.props.route.params.image){
            pic_Id = this.props.route.params.image;
          }
        }
        this.state = {
            text: state_text,
            picId:pic_Id,
            image:pic_Id,
            arr_upload:[],
            gai:false,
            flag:[],
        }
    }

    componentWillMount() {
        this.props.route.sendTweet = this.sendTweet.bind(this)
    }
    componentDidMount(){
        DeviceEventEmitter.addListener('change',(emoji)=>{
          if(!this.state.text){
            var start = 0;
            let obj={
              start:start,
              end:start+2,
              emoji:emoji,
            }
            this.setState({
              text :charFromUtf16(emoji),
              arr_upload:this.state.arr_upload.concat([obj]),
            })
          }else{
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
          }
        })
        DeviceEventEmitter.addListener('flag',(flag)=>{
          if(flag.length>=this.state.flag.length){
            this.setState({
              flag:flag,
              gai:true,
            })
          }
        })
        DeviceEventEmitter.addListener('picchange',(id)=>{
          console.log("进来了");
          console.log(id);
          if(this.state.picId == ''){
            var res = id;
          }else{
            var res = this.state.picId + ',' + id;
          }
          this.setState({
              picId:res,
          })
        })
        DeviceEventEmitter.addListener('atname',(name)=>{
          if(!this.state.text){
            this.setState({
              text:'@'+name,
            })
          }else{
            this.setState({
              text:this.state.text+'@'+name,
            })
          }
        })
    }

    render() {
        var flag =!this.state.gai? true:this.state.flag[this.state.flag.length-1];
        return (
            <View style={styles.container}>
                <NavbarComp route={this.props.route} navigator={this.props.navigator} flag={flag}/>
                <Editor
                    onChangeText={this.onChangeText.bind(this)}
                    placeholder={'说点什么吧...'}
                    text={this.state.text}
                    image={this.state.image}
                    navigator={this.props.navigator}
                    />
            </View>
        )
    }




//需添加存数据操作
    sendTweet() {
      if(this.state.flag.length==0||this.state.flag[this.state.flag.length-1]){
        var urls='';
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

          }
          arr[i] = text.slice(arr_upload[i-1].end);
          upload_text+=arr[i];
        }else{
          if(this.state.text){
            upload_text=this.state.text;
          }else{
            upload_text='';
          }
        }
        ajax({
              url: 'PublishApi/addPublish?username='+this.props.user.username+'&content='+upload_text+'&urls='+this.state.picId,
              data:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization':this.props.user.tokenStr
              },
              method:'POST'
        })
        this.props.navigator.push({
            title: 'HiApp',
            id: 'index',
            flag:1,
        })
      }
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
            text: text,
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
)(TweetView)
