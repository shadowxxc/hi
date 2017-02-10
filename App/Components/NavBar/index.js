import React, {
    Component
} from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    Platform
} from 'react-native'

import NavigationBar from 'react-native-navbar'
import iconfontConf from '../../Utils/iconfontConf'

const styles = {
    navbar: {
        alignItems: 'center',
        borderColor: '#e1e1e1',
        borderBottomWidth: 1
    },
    title: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5
    },
    titleText: {
        fontSize: 18
    },
    button: {
        width: 35,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 16,
        color: '#333'
    },
    buttonIconFontText: {
        fontSize: 26,
        fontFamily: 'iconfont'
    }
}

function _renderBarButton(text, handler, icon = false, buttonStyle = {}, buttonTextStyle = {}) {
    let buttonText = [styles.buttonText, buttonTextStyle]
    if(icon) {
        text = iconfontConf(text)
        buttonText = [buttonText, styles.buttonIconFontText]
    }
    return (
        <TouchableOpacity
            onPress={handler}
            style={[styles.button, buttonStyle]}>
            <Text style={buttonText}>{text}</Text>
        </TouchableOpacity>
    )
}

export default class NavbarComp extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    _leftButton() {
        switch (this.props.route.id) {
        case 'index':
            return _renderBarButton('搜索', () => {
                this.props.navigator.push({
                    title: '搜索',
                    id: 'search',
                    params:{
                      user:this.props.user,
                    }
                })
            }, false, {
                width: 50
            })
        case 'tweet':
        case 'name':
        case 'address':
            return _renderBarButton('取消', () => this.props.navigator.pop(), false, {
                width: 50,
                marginLeft: 10
            })
        case 'tweetDetails':
            return _renderBarButton('uniE617', this.props.route.callBackHome, true, {
                width: 50,
                marginLeft: 10
            })
        case 'touxiang':
            return _renderBarButton('uniE617', this.props.route.sendTweet2, true, {
                width: 50,
                marginLeft: 10
            })
        case 'user':
            return _renderBarButton('uniE617', this.props.route.sendTweet2, true, {
                width: 50,
                marginLeft: 10
            })
        default:
            return _renderBarButton('uniE617', () => this.props.navigator.pop(), true)
        }
    }

    _rightButton() {
        switch (this.props.route.id) {
        case 'index':
            return _renderBarButton('uniE601', () => {
                this.props.navigator.push({
                    title: '新消息',
                    id: 'tweet',
                    params:{
                      user:this.props.user
                    }
                })
            }, true, {
                width: 50
            })
        case 'about':
            return (<View></View>)
        case 'name':
        case 'address':
          return _renderBarButton('确定', this.props.route.sendTweet, false, {
            width: 50,
            marginRight: 7
          })
        case 'touxiang':
          return _renderBarButton('换头像', this.props.route.sendTweet, false, {
            width: 80,
            marginRight: 7,

          })
        case 'tweet':
          if(this.props.flag){
            return _renderBarButton('发表', this.props.route.sendTweet, false, {
              width: 50,
              marginRight: 7
            })
          }else{
            return _renderBarButton('...', this.props.route.sendTweet, false, {
              width: 50,
              marginRight: 7,
            })
          }
        case 'feedback':
            return _renderBarButton('uniE603', this.props.route.sendFeedback, true, {
                paddingRight: 5
            })
        case 'tweetDetails':
            return _renderBarButton('uniE60D', this.props.route.comment, true, {
                paddingRight: 5
            })
        case 'comment':
            return _renderBarButton('uniE603', this.props.route.sendComment, true, {
                paddingRight: 5
            })
        default:
            break
        }
    }

    _title() {
        var title_tag = this.props.route.title;;
        if (!this.props.route.title) {
          title_tag = "HiApp";
        }
        return (
            <View style={styles.title}>
                <Text style={styles.titleText}>{title_tag}</Text>
            </View>
        )
    }

    render() {
        let style = {
            paddingTop: 0,
            height: Platform.OS === 'android' ? 56 : 44
        }
        return (
            <NavigationBar
                style={[styles.navbar, style]}
                tintColor={'#f7f7f8'}
                leftButton={this._leftButton()}
                rightButton={this._rightButton()}
                title={this._title()}
            />
        )
    }
}
