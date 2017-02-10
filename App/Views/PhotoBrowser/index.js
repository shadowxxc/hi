import React, {
    Component
} from 'react'

import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    Image
} from 'react-native'
import NavbarComp from '../../Components/NavBar'
import icons from '../../assets/Icons.js'

import Swiper from 'react-native-swiper'
var images=[];
var index;
export default class FeedbackView extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
        images = this.props.route.params.pic;
    }

    render() {
        return (
          <View style={{backgroundColor:'#000'}}>
                <Swiper
                   style={{flex:1}}
                   paginationStyle={{bottom:110}}
                   loop={false}
                   index={this.props.route.params.index}
                   dot={<View style={{width:8,height:8,backgroundColor:'gray',borderRadius:4,marginLeft:3,marginRight:3}}></View>}
                   activeDot={<View style={{width:8,height:8,backgroundColor:'orange',borderRadius:4,marginLeft:3,marginRight:3}}></View>}
                   >
                    {this.renderImg()}
               </Swiper>
         </View>
        )
    }

    _goBack(){
      this.props.navigator.pop();
    }

    renderImg(){
        var imageViews=[];
        for(var i=0;i<images.length;i++){
            imageViews.push(
                <Image
                    key={i}
                    style={{flex:1}}
                    resizeMode= {Image.resizeMode.contain}
                    source={{uri:'http://192.168.10.58:9095/api/BaseApi/getImage?id='+images[i]+'&w=900&h=1220'}}
                >
                <TouchableOpacity onPress={this._goBack.bind(this)} style={{flex:1}}>
                </TouchableOpacity>
                </Image>
            );
        }
        return imageViews;
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1
    }
})
