import React, {
    Component
} from 'react'

import {
    View,
    Text,
    Image,
    Platform,
    ListView,
    StyleSheet,
    ActivityIndicator
} from 'react-native'

import styleUtils from '../../Styles'
import iconfontConf from '../../Utils/iconfontConf'
import {getAvatarUrl} from '../../Utils'
const charFromUtf16 = utf16 => String.fromCodePoint(...utf16.split('-').map(u => '0x' + u))


export default class CommentsComp extends Component {
    constructor(props) {
        super(props)
        
    }

    render() {
        if(this.props.loadding) {
            return this._renderSpinner()
        } else if(this.props.comments.length) {
            return this._renderCommentList()
        } else {
            return this._renderEmptyList()
        }
    }

    _renderCommentList() {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        let dataSource = ds.cloneWithRows(this.props.comments)
        return (
            <ListView
                dataSource={dataSource}
                renderRow={this._renderCommentRow}
                style={styles.container}
            />
        )
    }

    _renderCommentRow(comment) {
      var xr_text = comment.content;
      for(var i=0;i<xr_text.length;i++){
        let text1 = xr_text.slice(i,i+3);
        let text2= xr_text.slice(i,i+4);
        let text3= xr_text.slice(i,i+5);
        if(text1=='1F6'||text1=='1F4'||text1=='1F3'||text2=='263A'||text2=='270B'||text2=='270C'){
          var arr = xr_text.split(text3);
          xr_text = arr[0];
          for(var j =1;j<arr.length;j++){
            xr_text += charFromUtf16(text3)+arr[j];
          }
        }
      }
      if(comment.photo){
        var id = comment.photo;
      }else{
        var id = 259;
      }
        return (
            <View style={styles.commentContainer}>
                <Image source={{uri: 'http://192.168.10.58:9095/api/BaseApi/getImage?id='+id+'&w=&h='}} style={styles.commentAvatar} />
                <View style={styles.commentRightContainer}>
                    <Text style={styles.commentName}>{comment.name}</Text>
                    <Text style={styles.commentText}>{xr_text}</Text>
                </View>
            </View>
        )
    }

    _renderEmptyList() {
        return (
            <View style={[styles.container, styles.emptyContainer]}>
                <Text style={styles.emptyIcon}>{iconfontConf('uniE612')}</Text>
                <Text style={styles.emptyText}>暂时还没有评论!</Text>
            </View>
        )
    }

    _renderSpinner() {
        let color = Platform.OS === 'android' ? styleUtils.androidSpinnerColor : 'gray'
        return (
            <View style={[styles.container, styles.spinnerContainer]}>
                <ActivityIndicator
                    animating={true}
                    size='small'
                    color={color}
                />
            </View>
        )
    }
}

CommentsComp.defaultProps = {
    loading: true,
    comments: []
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f7f7f7'
    },
    emptyContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyIcon: {
        fontFamily: 'iconfont',
        color: '#dbdbdb',
        fontSize: 80
    },
    emptyText: {
        color: '#dbdbdb',
        fontSize: 16,
        marginTop: 25
    },
    spinnerContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    commentContainer: {
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderColor: '#e1e1e1',
        borderBottomWidth: 1
    },
    commentAvatar: {
        backgroundColor: 'gray',
        width: 35,
        height: 35,
        borderRadius: 4,
        marginRight: 6
    },
    commentName: {
        color: '#6d6d72',
        fontSize: 12
    },
    commentText: {
        color: '#6d6d72',
        fontSize: 14
    }
})
