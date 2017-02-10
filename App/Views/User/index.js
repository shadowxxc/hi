import React, {
    Component
} from 'react'

import {
    StyleSheet,
    View,
    Image,
    Text,
    AsyncStorage,
    TouchableHighlight
} from 'react-native'

import capitalize from 'lodash/capitalize'

import ItemCell from '../../Components/ItemCell'
import NavbarComp from '../../Components/NavBar'
import styleUtils from '../../Styles'
import {connect} from "react-redux";
import {store} from '../../store'
import {gotoChangeName} from '../../Components/goto'


class userView extends Component {
    constructor(props) {
        super(props);
        this.state={
          add:'',
          person:'',
          sex:'',
          id:259,
          flag:false,
        }
        fetch('http://192.168.10.58:9095/api/UserApi/getUser?tokenStr='+this.props.user.tokenStr,{
          method:'POST',
          headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization':this.props.user.tokenStr
          }
        })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
            if(!res.err_code) {
              console.log(res);
              if(res.obj.address){
                var add=res.obj.address;
              }else{
                var add='';
              }
              if(res.obj.sign){
                var person=res.obj.sign;
              }else{
                var person='';
              }
              if(res.obj.sex==0){
                var sex='男';
              }else if(res.obj.sex==1){
                var sex='女';
              }else{
                var sex='';
              }
              if(res.obj.photo){
                var id=res.obj.photo
              }else{
                var id =259;
              }
              this.setState({
                add:add,
                person:person,
                sex:sex,
                id:id,
              })
            }
        })
    }

    componentWillMount() {
      this.props.route.sendTweet2 = this.sendTweet2.bind(this)
    }

    sendTweet2(){
      if(this.state.flag){
        this.props.route.callBack(this.state.img);
      }
      this.props.navigator.pop();
    }

    render() {
      if(!this.state.flag){
        var touxiang = (
          <ItemCell
              onPress={this._changeTouxiang.bind(this)}
              showDisclosureIndicator={true}
              showBottomBorder={false}
              containerStyle={itemCellColor.container}
              touxiang={{uri: 'http://192.168.10.58:9095/api/BaseApi/getImage?id='+this.state.id+'&w=&h='}}>
              头像
          </ItemCell>
        )
      }else{
        var touxiang = (
          <ItemCell
              onPress={this._changeTouxiang.bind(this)}
              showDisclosureIndicator={true}
              showBottomBorder={false}
              containerStyle={itemCellColor.container}
              touxiang={this.state.img}>
              头像
          </ItemCell>
        )
      }
        return (
            <View>
                <NavbarComp route={this.props.route} navigator={this.props.navigator}/>
                <ItemCell
                showBottomBorder={false}
                iconStyle={itemCellColor.aboutIcon}
                subText={this.props.user.username}>
                用户名
                </ItemCell>
                {touxiang}
                <ItemCell
                    onPress={gotoChangeName.bind(this)}
                    showDisclosureIndicator={true}
                    showBottomBorder={false}
                    containerStyle={itemCellColor.container}
                    subText={this.props.user.name}>
                    姓名
                </ItemCell>
                <ItemCell
                    onPress={this._changeSex.bind(this)}
                    showDisclosureIndicator={true}
                    showBottomBorder={false}
                    containerStyle={itemCellColor.container}
                    subText={this.state.sex}>
                    性别
                </ItemCell>
                <ItemCell
                    onPress={this._changeAdd.bind(this,'我的地址')}
                    showDisclosureIndicator={true}
                    showBottomBorder={false}
                    containerStyle={itemCellColor.container}
                    subText={this.state.add}>
                    地址
                </ItemCell>
                <ItemCell
                    onPress={this._changeAdd.bind(this,'个性签名')}
                    showDisclosureIndicator={true}
                    showBottomBorder={false}
                    containerStyle={itemCellColor.container}
                    subText={this.state.person}>
                    个性签名
                </ItemCell>
            </View>
        )
    }

    _changeTouxiang(){
      this.props.navigator.push({
        id:'touxiang',
        title:'个人头像',
        params:{
          id:this.state.id,
          user:this.props.user
        },
        callBack: this.changed.bind(this)
      })

    }

    _changeAdd(title){
      if(title=='我的地址'){
        var add =this.state.add;
      }else{
        var add =this.state.person;
      }
      this.props.navigator.push({
        id:'address',
        title:title,
        params:{
          add:add,
          user:this.props.user
        },
        callBack: this.changed.bind(this)
      })
    }

    _changeSex(){
      this.props.navigator.push({
        id:'sex',
        title:'性别',
        params:{
          sex:this.state.sex,
          user:this.props.user
        },
        callBack: this.changed.bind(this)
      })
    }

    changed(filedKey,text){
      switch (filedKey) {
        case 'address':
            this.setState({
              add:text
            })
          break;
        case 'person':
            this.setState({
              person:text
            })
          break;
        case 'sex':
            this.setState({
              sex:text
            })
          break;
        case 'touxiang':
            this.setState({
              id:text,
              flag:true
            })
          break;
        default:

      }
    }

    _gotoView(id,view) {
        this.props.navigator.push({
            title: view,
            id: id
        })
    }
}

const itemCellColor = {
    container: styleUtils.itemCell,
    feedbackIcon: {
        backgroundColor: '#38b57f'
    },
    languageIcon: {
        backgroundColor: '#9b59b6'
    },
    aboutIcon: {
        backgroundColor: '#5999f3'
    }
}

const Styles = StyleSheet.create({
    tweetContainer: {
        ...styleUtils.itemCell,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingTop: 4,
        paddingBottom: 10
    },
    viewCommit:{
      marginTop:20,
      marginLeft:10,
      marginRight:10,
      backgroundColor:'#ff9630',
      height:40,
      borderRadius:5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatar: {
        backgroundColor: 'gray',
        width: 50,
        height: 50,
        marginLeft: 10,
        borderRadius: 4
    },
    userContainer: {
        flexDirection: 'row'
    },
    time: {
        marginLeft: 4,
        fontSize: 13,
        color: '#8999a5',
        marginTop: 2
    },
    name: {
        fontWeight: '600',
        fontSize: 15
    },
    rightContainer: {
        flexGrow: 1,
        padding: 10
    },
    ponit: {
        marginLeft: 0
    },
    logoutButton: {
        backgroundColor: '#ff3b30',
        borderWidth: 0,
        margin: 10,
        marginTop: 20
    },
    logoutButtonFontsize: {
        fontSize: 18,
        color: 'white'
    }
})
export default connect(
  (state) => (state)
)(userView)
