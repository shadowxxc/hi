import React, {
    Component,
    PropTypes
} from 'react'

import {
    View,
    Text,
    Image,
    TouchableHighlight,
    StyleSheet,
    PixelRatio
} from 'react-native'

import icons from '../../assets/Icons.js'
export default class ItemCell extends Component {
    _renderDisclosureIndicator() {
        if (this.props.showDisclosureIndicator) {
            return (
                <Image source={require('../../assets/angle_right.png')} style={styles.chevron}></Image>
            )
        }
    }

    _renderSubText() {
        if(this.props.subText) {
            return (
                <Text style={styles.subText}>{this.props.subText}</Text>
            )
        }
    }

    _renderGou() {
        if (this.props.selected) {
            return (
                <View style={styles.sex}>
                    <Image style={styles.gou}
                        source={{uri:icons.gou}}
                        />
                </View>
            )
        }
        return <View style={styles.sex}/>
    }
    _renderIcon() {
        if (this.props.icon) {
            return (
                <View style={[this.props.iconStyle, styles.iconContainer]}>
                    <View style={styles.paddingView} />
                    <Image style={styles.icon}
                        source={this.props.icon}
                        resizeMode='cover'
                        />
                    <View style={styles.paddingView} />
                </View>
            )
        }
        return <View style={styles.paddingView} />
    }

    _renderTouXiang(){
      if (this.props.touxiang) {
          return (
              <View style={[this.props.iconStyle, styles.iconContainer]}>
                  <View style={styles.paddingView} />
                  <Image style={styles.icon}
                      source={this.props.touxiang}
                      resizeMode='cover'
                      />
                  <View style={styles.paddingView} />
              </View>
          )
      }
      return <View style={styles.paddingView} />
    }

    render() {
        let touchableProps = {
            accessible: this.props.accessible,
            delayLongPress: this.props.delayLongPress,
            delayPressIn: this.props.delayPressIn,
            delayPressOut: this.props.delayPressOut,
            onLongPress: this.props.onLongPress,
            onPress: this.props.onPress,
            onPressIn: this.props.onPressIn,
            onPressOut: this.props.onPressOut,
        }
        if(this.props.id=="setting"){
          return (
            <TouchableHighlight {...touchableProps}
            underlayColor='#D9D9D9'
            style={[styles.container, this.props.containerStyle]}>
            <View style={styles.viewContainer}>
            <View style={styles.leftContainer}>
            {this._renderIcon() }
            </View>
            <View style={styles.flex}>
            <View style={styles.textContainer}>
            <Text style={styles.text}>
            {this.props.children}
            </Text>
            {this._renderSubText()}
            {this._renderDisclosureIndicator() }
            </View>
            </View>
            </View>
            </TouchableHighlight>
          )
        }else{
            return (
              <TouchableHighlight {...touchableProps}
              underlayColor='#fff'
              style={[styles.container, this.props.containerStyle]}>
              <View style={styles.viewContainer}>
                <View style={styles.leftContainer}>
                  <Text>
                    {this.props.children}
                  </Text>
                </View>
                <View style={styles.flex}>
                  <View style={styles.textContainer}>
                    <Text style={styles.text2}>
                    </Text>
                    {this._renderSubText()}
                    {this._renderTouXiang()}
                    {this._renderGou()}
                    {this._renderDisclosureIndicator() }
                  </View>
                </View>
              </View>
              </TouchableHighlight>
            )
          }
    }
}

ItemCell.propTypes = {
    ...TouchableHighlight.propTypes,
    children: PropTypes.string.isRequired,
    showDisclosureIndicator: PropTypes.bool,
    showBottomBorder: PropTypes.bool,
    icon: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
            uri: PropTypes.string,
        }),
    ]),
    iconStyle: PropTypes.object,
    containerStyle: PropTypes.object
}

const styles = StyleSheet.create({
    sex:{
      height:20,
    },
    gou:{
      height:22,
      width:22,
      marginRight:20,
    },
    text2:{
      flexGrow: 1,
      textAlign:'right'
    },
    container: {
        flexGrow: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        marginLeft:0,
        marginRight:0,
    },
    viewContainer: {
        marginLeft: 10,
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1 / 2,
        borderBottomColor: '#C8C7CC',
        borderStyle: 'solid',
    },
    leftContainer: {
        marginTop: 5,
        marginBottom: 5,
    },
    flex: {
        flexGrow: 1
    },
    paddingView: {
        width: 15,
        backgroundColor: 'white',
    },
    textContainer: {
        flexGrow: 1,
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    text: {
        flexGrow: 1,
        fontSize: 16,
        alignSelf: 'center',
    },
    subText: {
        fontSize: 14,
        color: '#8e8e93'
    },
    chevron: {
        width: 23,
        height: 23,
    },
    iconContainer: {
        alignItems: 'center',
        width: 45,
        height: 45,
        justifyContent: 'center',
        marginRight: 4,

    },
    icon: {
        width: 40,
        height: 40
    }
})
