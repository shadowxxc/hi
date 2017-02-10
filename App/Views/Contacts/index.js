import React, {
    Component
} from 'react'

import {
    StyleSheet,
    Platform,
    View,
    Text,
    TextInput,
    TouchableHighlight
} from 'react-native'

import GiftedListView from 'react-native-gifted-listview'
import ItemCell from '../../Components/ItemCell'
import styleUtils from '../../Styles'
import {ajax} from '../../Network'
import {getAvatarUrl} from '../../Utils'
import {gotoMessage} from '../../Components/goto'
// import groupBy from 'lodash/groupBy'
// import PY from '../../Components/ChinesePY'
import {connect} from "react-redux";
import {store} from '../../store'

class Contacts extends Component {
    constructor(props) {
        super(props)
        this.state = {
          arr:[],
          text:'',
        }
    }

    render() {
        let color = Platform.OS === 'android' ? styleUtils.androidSpinnerColor : 'gray'
        return (

            <GiftedListView
                enableEmptySections={true}
                customStyles={customStyles}
                rowView={this._renderRowView.bind(this)}
                onFetch={this._onFetch.bind(this)}
                firstLoader={true}
                pagination={true}
                refreshable={true}
                withSections={true}
                sectionHeaderView={this._renderSectionHeaderView}
                spinnerColor={color}
                />
        )
    }

    _onFetch(page = 1, callback, options) {
          ajax({
              url: 'UserApi/getUsers?keyword=',
              data:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization':this.props.user.tokenStr
              },
              method:'POST'
          }).then(res => {
              if (!res.err_code) {
                  this.setState({
                    arr:res.obj,
                  });
                  callback(this.state.arr, {
                      allLoaded: true
                  })
              }
          })
    }


    _renderRowView(contact) {
      if(contact.photo){
        var id = contact.photo;
      }else{
        var id = 259;
      }
        return (
            <ItemCell
                onPress={this._gotoMessageView.bind(this, contact)}
                subText={contact.location}
                showDisclosureIndicator={true}
                showBottomBorder={true}
                id='setting'
                iconStyle={customStyles.itemCellIcon}
                icon={{ uri: 'http://192.168.10.58:9095/api/BaseApi/getImage?id='+id+'&w=&h=' }}>
                {contact.name}
            </ItemCell>
        )
    }

    _renderSectionHeaderView(sectionData, sectionID) {
        return (
            <View style={Styles.sectionHeader}>
                <Text style={Styles.sectionHeaderText}>
                    {sectionID}
                </Text>
            </View>
        )
    }

    _gotoMessageView(contact) {
      gotoMessage(this.props.navigator,contact);
    }
}

const customStyles = {
    paginationView: {
        ...styleUtils.containerBg
    }
}

const Styles = StyleSheet.create({
    sectionHeader: {
        ...styleUtils.containerBg,
        height: 30,
        paddingLeft: 15,
        justifyContent: 'center'
    },
    sectionHeaderText: {
        color: '#8e8e93'
    }
})

export default connect(
  (state) => (state)
)(Contacts)
