import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import Composer from './Composer';
import Send from './Send';

export default class InputToolbar extends React.Component {
  renderActions() {
    if (this.props.renderActions) {
      return this.props.renderActions(this.props);
    }
    return null;
  }

  renderSend() {
    if (this.props.renderSend) {
      return this.props.renderSend(this.props);
    }
    return <Send {...this.props}/>;
  }

  renderComposer() {
    if (this.props.renderComposer) {
      return this.props.renderComposer(this.props);
    }

    return (
      <Composer
        {...this.props}
      />
    );
  }

  renderAccessory() {
    if (this.props.renderAccessory) {
      return (
        <View style={[styles.accessory, this.props.accessoryStyle]}>
          {this.props.renderAccessory(this.props)}
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.primary}>
          {this.renderActions()}
          {this.renderComposer()}
          {this.renderSend()}
        </View>
        {this.renderAccessory()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginRight:10,
    marginLeft:10,
    borderRadius:10,
    backgroundColor: '#FFFFFF',
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  accessory: {
    height: 44,
  },
});

InputToolbar.defaultProps = {
  renderAccessory: null,
  renderActions: null,
  renderSend: null,
  renderComposer: null,
  containerStyle: {},
  primaryStyle: {},
  accessoryStyle: {},
};

InputToolbar.propTypes = {
  renderAccessory: React.PropTypes.func,
  renderActions: React.PropTypes.func,
  renderSend: React.PropTypes.func,
  renderComposer: React.PropTypes.func,
  containerStyle: View.propTypes.style,
  primaryStyle: View.propTypes.style,
  accessoryStyle: View.propTypes.style,
};
