import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { COLORS, BOOKSIMAGEFOLDER, FONTSIZE } from '../../const';
import _ from 'lodash';

//入口参数：

//id
//bookrenderitem
//ondetailpress

//字段：

// id: '',
// name: '',
// barcode: '',
// author: '',
// date: '',
// cate: '',
// image: ''

export default class BookRenderItem extends React.PureComponent {
  _ondetailpress = () => {
    this.props.ondetailpress(this.props.bookrenderitem);
  };
  render() {
    return (
      <View style={styles.itemView}>
        <TouchableOpacity onPress={this._ondetailpress} style={styles.itemPanel}>
          <View style={styles.imageView}>
            {
              (!_.isNil(this.props.bookrenderitem.image) && !_.isEmpty(this.props.bookrenderitem.image)) ?
                <Image
                  style={styles.image}
                  source={{ uri: BOOKSIMAGEFOLDER + this.props.bookrenderitem.image }}
                />
                :
                <Image
                  style={styles.image}
                  source={require('../../assets/empty.png')}
                />
            }
          </View>
          <View style={styles.detailView}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{'条码： ' + this.props.bookrenderitem.barcode}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{'书名： ' + this.props.bookrenderitem.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{'作者： ' + this.props.bookrenderitem.author}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{'购入日期： ' + this.props.bookrenderitem.date}</Text>
            </View>
          </View>
          <View style={styles.cateView}>
            <View style={styles.cateIcon}>
              <Text style={styles.cateLabel}>{this.props.bookrenderitem.cate}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View >
    )
  }
}

const styles = StyleSheet.create(
  {
    itemView: {
      flex: 1,
      marginBottom: 5,
      height: 90,
      borderColor: COLORS.border,
      borderWidth: 1,
      borderRadius: 0,
      backgroundColor: COLORS.white,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "stretch"
    },
    itemPanel: {
      flex: 1,
      padding: 5,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "stretch",
    },
    imageView: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "stretch",
      height: 80,
      width: 80
    },
    imagePanel: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "stretch",
    },
    image: {
      height:80,
      width:80
    },
    detailView: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "stretch",
      paddingLeft: 3
    },
    detailRow: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "stretch",
    },
    detailLabel: {
      fontSize: FONTSIZE.small
    },
    cateView: {
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "stretch",
      height: 80,
      width: 60
    },
    cateIcon: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "stretch",
      borderColor: COLORS.border,
      borderWidth: 1,
      borderRadius: 100,
      backgroundColor: COLORS.main,
      height: 30,
      width: 60
    },
    cateLabel: {
      marginTop: 4,
      fontSize: FONTSIZE.small,
      color: COLORS.white

    }
  }
)