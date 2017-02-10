import React, {
    Component
} from 'react'

import {
    BackAndroid,
    Navigator,
    Platform,
    View,
    AsyncStorage,
    ToastAndroid
} from 'react-native'

// import CookieManager from 'react-native-cookies'
// import Realm from 'realm'
import WelcomeView from '../../Views/Welcome'
import NavbarComp from '../NavBar'
import styleUtils from '../../Styles'
import LoginView from '../../Views/Login'
import RegisterView from '../../Views/Register'
import HomeView from '../../Views/Home'
import IndexView from '../../Views/Index'
import AboutView from '../../Views/About'
import MessageView from '../../Views/Message'
import TweetView from '../../Views/Tweet'
import FeedbackView from '../../Views/Feedback'
import WebViewView from '../../Views/WebView'
import TweetDetailsView from '../../Views/TweetDetails'
import CommentView from '../../Views/Comment'
import PhotoBrowserView from '../../Views/PhotoBrowser'
import SearchView from '../../Views/Search'
import AtView from '../../Views/At'
import UserView from '../../Views/User'
import NameView from '../../Views/Name'
import AddressView from '../../Views/AddressView'
import SexView from '../../Views/Sex'
import TouxiangView from '../../Views/Touxiang'
import CsView from '../../Views/cs'
import {Provider} from 'react-redux';
import {store} from '../../store';

const NoBackSwipe = {
    ...Navigator.SceneConfigs.HorizontalSwipeJump,
    gestures: {
        pop: {}
    }
}

var firstClick = 0

export default class NavigatorComp extends Component {

    constructor(){
        super()
        this.handleBack = this.handleBack.bind(this);
        this.state = {
    			isLoading: true,
    		}
    }

    componentWillUnmount () {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBack)
    }

    render() {
        return (
          <Provider store={store}>
              <View style={styles.container}>
                  <Navigator
                      ref='navigator'
                      initialRoute={{id: 'welcome'}}
                      configureScene={this._configureScene}
                      renderScene={this._renderScene}
                  />
              </View>
          </Provider>
        )

    }

    handleBack(){
        const {navigator} = this.refs
        var routeArr = navigator.getCurrentRoutes();
        if (navigator && routeArr.length >1&&routeArr[routeArr.length-2].id!='login'&&routeArr[routeArr.length-1].id!='index'&&routeArr[routeArr.length-2].id!='register'&&routeArr[routeArr.length-1].id!='login'&&routeArr[routeArr.length-1].id!='register') {
            navigator.pop()
            return true
        }else{
            var timestamp = (new Date()).valueOf()
            if(timestamp-firstClick>2000){
                firstClick = timestamp
                ToastAndroid.show('再按一次退出应用',ToastAndroid.SHORT)
                return true
            }else{
                return false
            }
        }
    }

    componentDidMount () {
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack)
    }

    _renderScene(route, navigator) {
        switch (route.id) {
        case 'cs':
            return (
                <CsView navigator={navigator} route={route}/>
            )
        case 'welcome':
            return (
                <WelcomeView navigator={navigator} route={route}/>
            )
        case 'index':
            return (
                <IndexView {...route.params} navigator={navigator} route={route}/>
            )
        case 'login':
            return (
                <LoginView {...route.params} navigator={navigator} route={route}/>
            )
        case 'register':
            return (
                <RegisterView navigator={navigator} route={route}/>
            )
        case 'user':
            return (
                <UserView {...route.params} navigator={navigator} route={route}/>
            )
        case 'name':
            return (
                <NameView {...route.params} navigator={navigator} route={route}/>
            )
        case 'address':
            return (
                <AddressView {...route.params} navigator={navigator} route={route}/>
            )
        case 'sex':
            return (
                <SexView {...route.params} navigator={navigator} route={route}/>
            )
        case 'touxiang':
            return (
                <TouxiangView {...route.params} navigator={navigator} route={route}/>
            )
        case 'about':
            return (
                <AboutView navigator={navigator} route={route}/>
            )
        case 'message':
            return (
                <MessageView {...route.params} navigator={navigator} route={route}/>
            )
        case 'tweet':
            return (
                <TweetView navigator={navigator} route={route}/>
            )
        case 'feedback':
            return (
                <FeedbackView navigator={navigator} route={route}/>
            )
        case 'search':
            return (
                <SearchView  {...route.params}  navigator={navigator} route={route}/>
            )
        case 'at':
            return (
                <AtView  {...route.params}  navigator={navigator} route={route}/>
            )
        case 'webview':
            return (
                <WebViewView {...route.params} navigator={navigator} route={route}/>
            )
        case 'tweetDetails':
            return (
                <TweetDetailsView {...route.params} navigator={navigator} route={route}/>
            )
        case 'comment':
            return (
                <CommentView {...route.params} navigator={navigator} route={route}/>
            )
        case 'photoBrowser':
            return (
                <PhotoBrowserView {...route.params} navigator={navigator} route={route}/>
            )
        default:
            break
        }
    }

    _configureScene(route, routeStack) {
        switch (route.id) {
        case 'index':
            if(route.flag===1){
                return Navigator.SceneConfigs.FloatFromLeft
            }else{
                return {
                    ...Navigator.SceneConfigs.FloatFromRight,
                    gestures: { }
                }
            }
        case 'tweet':
        case 'search':
        case 'webview':
        case 'welcome':
        case 'photoBrowser':
        case 'login':
        case 'at':
            return Navigator.SceneConfigs.FloatFromBottom
        default:
            return Navigator.SceneConfigs.FloatFromRight
        }
    }
}

const styles = {
    container: {
        flexGrow: 1
    }
}
