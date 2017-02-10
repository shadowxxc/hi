import React from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Alert
} from 'react-native'

// var SocketIO = require('react-native-swift-socketio');

export default class MessageView extends React.Component {
  constructor () {
    super();
    // this.socket = new SocketIO('localhost:3000', {});
    // this.state = { status: 'Not connected' };
}

componentDidMount () {
    // 
    // this.socket.on('connect', () => {
    //   this.setState({
    //     status: 'Connected'
    //   });
    // });
    //
    // this.socket.connect();
  }

  // emitEvent () {
  //   this.socket.emit('randomEvent', {
  //     some: 'data'
  //   });
  // }

  render () {
    return (
      <View style={styles.container}>

        <TouchableWithoutFeedback style={styles.btn} onPress={() => this.emitEvent()}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>
              Emit an event
            </Text>
          </View>
        </TouchableWithoutFeedback>

        <Text style={styles.status}>
          Connection status: {this.state.status}
        </Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#F5FCFF',
   },

   btn: {
     backgroundColor: '#4F67FF',
     padding: 30,
     borderRadius: 5
   },

   btnText: {
     color: '#fff'
   }
})
