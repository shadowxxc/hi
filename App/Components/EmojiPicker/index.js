'use strict'
import React, {
  PropTypes,
  Component,
} from 'react'

import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Platform,
} from 'react-native'

import emoji from 'emoji-datasource'

import {
  groupBy,
  orderBy,
  includes,
} from 'lodash/collection'

import {
  mapValues,
} from 'lodash/object'

require('string.fromcodepoint');

const charFromUtf16 = utf16 => String.fromCodePoint(...utf16.split('-').map(u => '0x' + u))

const charFromEmojiObj = obj => obj.unified
const blacklistedEmojis = ['white_frowning_face', 'keycap_star', 'eject']

const isAndroid = Platform.OS == 'android'
const letterSpacing = 10
const defaultEmojiSize = 30
const padding = 5
const filteredEmojis = emoji.filter(e => isAndroid ? !!e.google : !includes(blacklistedEmojis, e.short_name))
const groupedAndSorted = groupBy(orderBy(filteredEmojis, 'sort_order'), 'category')
const emojisByCategory = mapValues(groupedAndSorted, group => group.map(charFromEmojiObj))

const CATEGORIES = ['People']


class EmojiPicker extends Component {
  state = {
    categories: CATEGORIES.slice(0, 1),
  }

  componentWillUnmount() {
    clearTimeout(this._timeout)
  }

  loadNextCategory() {
    if (this.state.categories.length < CATEGORIES.length) {
      this.setState({categories: CATEGORIES.slice(0, this.state.categories.length + 1)})
    }
  }

  renderCategory(category) {
    return (
      <EmojiCategory
        {...this.props}
        key={category}
        category={category}
        finishedLoading={() => this._timeout = setTimeout(this.loadNextCategory.bind(this), 100)} />
      )
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <ScrollView horizontal={true}>
          {this.state.categories.map(this.renderCategory.bind(this))}
        </ScrollView>
        {this.props.hideClearButton ? null : <ClearButon {...this.props} />}
      </View>
    )
  }

}

class EmojiCategory extends Component {
  componentDidMount() {
    this.props.finishedLoading()
  }

  render() {
    let emojis = emojisByCategory[this.props.category]
    let size = this.props.emojiSize || defaultEmojiSize
    let style = {
      fontSize: size-4,
      color: '#e9bd32',
      height: size+20,
      width: size+20,
      textAlign: 'center',
      padding: padding,
    }

    return (
     <View style={style.categoryOuter}>
        <View style={styles.categoryInner}>
          {emojis.map(e =>
            <Text style={style}
              key={e}
              onPress={() => this.props.onEmojiSelected(e)}>
              {charFromUtf16(e)}
            </Text>
          )}
        </View>
      </View>
    )
  }
}


const ClearButon = props => {
  return (
    <TouchableOpacity
      onPress={() => props.onEmojiSelected(null)}>
      <Text style={[styles.clearButton, props.clearButtonStyle]}>
        {props.clearButtonText || 'Clear'}
      </Text>
    </TouchableOpacity>
  )
}

const EmojiOverlay = props => (
  <View style={[styles.absolute, props.visible ? styles.visible : styles.hidden]}>
    <TouchableOpacity style={styles.absolute} onPress={props.onTapOutside}>
      <View style={styles.background} />
    </TouchableOpacity>
    {props.visible ? <EmojiPicker {...props}/> : null}
  </View>
)

let styles = StyleSheet.create({
  container: {
    padding: padding,
  },
  clearButton: {
    flex: 1,
    height:0,
    textAlign: 'center',
    color: 'black',
    textAlignVertical: 'center',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  visible: {
    top: 0,
    flex: 1,
    justifyContent: 'center',
  },
  hidden: {
    top: 1000,
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: 'grey',
    opacity: 0.5,
  },
  categoryOuter: {
    flex: -1,
  },
  categoryInner: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  headerText: {
    padding: padding,
    color: 'black',
    justifyContent: 'center',
    textAlignVertical: 'center',
  },
})

EmojiPicker.propTypes = {
  onEmojiSelected: PropTypes.func.isRequired,
}

export { EmojiPicker as default, EmojiOverlay as EmojiOverlay }
