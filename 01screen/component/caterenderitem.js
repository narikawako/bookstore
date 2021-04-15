import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { COLORS, FONTSIZE } from '../../const';
import _ from 'lodash';

//入口参数：

//name
//ondetailpress

export default class CateRenderItem extends React.PureComponent {
  _ondetailpress = () => {
    this.props.ondetailpress(this.props.name);
  };
  render() {
    return (
      <View style={styles.item}>
        <TouchableOpacity onPress={this._ondetailpress} style={styles.innerbutton}>
          <View style={styles.headcontent}>
            <View style={styles.headtitle}>
              <Text style={styles.headtext} numberOfLines={1}>{this.props.name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View >
    );
  }
}

const styles = StyleSheet.create(
  {
    item: {
      flex: 1,
      marginBottom: 5,
      height: 40,
      borderColor: COLORS.border,
      borderWidth: 1,
      borderRadius: 0,
      backgroundColor: COLORS.white,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "stretch"
    },
    innerbutton: {
      flex: 1,
      padding: 5,
      borderWidth: 0,
      borderRadius: 0,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "stretch",
    },
    headcontent: {
      height: 30,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      // borderColor: COLORS.border,
      // borderWidth: 1,
    },
    headtitle: {
      flex: 1,
      height: 30,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center"
    },
    headtext: {
      color: COLORS.black,
      fontSize: FONTSIZE.default,
      flex: 1,
      textAlign: 'left',
      fontWeight: 'bold'
    },
  }
)