import React, {
    Component
} from 'react';

import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableHighlight,
    ListView,
    ScrollView,
    Image
} from 'react-native';

import {ajax} from '../../Network'
import NavbarComp from '../../Components/NavBar'

var that;
export default class ATView extends Component{
  constructor(props) {
      super(props);
      that=this;
      this.state = {
          contacts:[],
      }
      ajax({
          url: 'UserApi/getUsers?keyword=',
          data:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization':this.props.route.params.user.tokenStr
          },
          method:'POST'
      }).then(res => {
          if (!res.err_code) {
            let content=this._changeObj(res.obj);
            console.log(content);
              this.setState({
                contacts:content
              });
          }
      });
  }

  render() {
    let con = this.state.contacts;
    let concacts = con.map((p, i) => {
      return (
        <TouchableHighlight key={i}
            underlayColor='#D9D9D9'
            style={Styles.container}
            onPress={this._getName.bind(that,p.name)}>
            <View style={Styles.viewContainer}>
                <View style={Styles.leftContainer}>
                    <Image source={require('../../assets/head.jpg')} style={Styles.image}></Image>
                </View>
                <View style={Styles.textContainer}>
                        <Text style={Styles.text}>
                            {p.name}
                        </Text>
                </View>
            </View>
        </TouchableHighlight>
      )
    })
      return (
        <View style={Styles.bg}>
          <NavbarComp route={this.props.route} navigator={this.props.navigator}/>
          <ScrollView>
            {concacts}
          </ScrollView>
        </View>
      )

  }

  _getName(name){
    this.props.route.callBack(name);
    this.props.navigator.pop();
  }

  _changeObj(obj){
    let arrFromObj = [];
    for(var key in obj){
        console.log("属性：" + key + ",值："+ obj[key][0].name);
        if(key!='ok'){
          // for(var i=0;i<obj[key].length;i)
          arrFromObj=arrFromObj.concat(obj[key]);
          console.log(arrFromObj[0].name);
        }
    }
    return arrFromObj;
  }

}

const Styles = StyleSheet.create({
image:{
  width:30,
  height:30,
  marginLeft:10,
},
container: {
    flexGrow: 1,
    flexDirection: 'row',
    marginTop:4,
},
viewContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
},
leftContainer: {
    marginTop: 5,
    marginBottom: 5,
},
textContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    marginLeft:15,
    alignItems: 'center',
},
})
