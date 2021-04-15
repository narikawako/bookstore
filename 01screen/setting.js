import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text, BackHandler, ToastAndroid, Alert } from 'react-native';
import _ from 'lodash';
import { COLORS, CommonStyles, DEVICE_BACK_ACTION } from '../const';
//react-navigation对页面的跳转会有缓存，A跳到B再退回到A的时候，不一定会调起Componentdidmount等生命周期方法，所以需要使用如下组件可以触发生命周期
import { NavigationEvents } from 'react-navigation';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { addbook, getbooklist } from '../05dbprovider/DBAction4Book'

export default class Setting extends React.Component {
  constructor(props) {
    super(props);
  }
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: () => (
        <View>
          <Text style={CommonStyles.headerTitle}>{'設定'}</Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: COLORS.main,
      },
      headerLeft: () => (
        <TouchableOpacity onPress={() => params.cancel()} style={CommonStyles.headerButtonLeft}>
          <Text style={CommonStyles.headerButtonText}>{"< 戻す"}</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity >
          <Text >{""}</Text>
        </TouchableOpacity>
      ),
    };
  };
  render() {
    return (
      <View style={CommonStyles.container}>
        <NavigationEvents onDidFocus={this._ondidfocus} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this._import} style={styles.button}>
            <Text style={styles.buttonText}>{'1：インポート'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this._export} style={styles.button}>
            <Text style={styles.buttonText}>{'2：エクスポート'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  _cancel = () => {
    this.props.navigation.goBack();
    return true;
  };
  _ondidfocus = async () => {
    BackHandler.addEventListener(DEVICE_BACK_ACTION, this._cancel);
    this.props.navigation.setParams({ cancel: this._cancel });
  };
  componentWillUnmount = () => {
    BackHandler.removeEventListener(DEVICE_BACK_ACTION, this._cancel);
  }

  _import = async () => {
    const { type, uri, name, size } = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (type === 'success') {
      const data = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.UTF8 })
      //console.log('data:' + JSON.stringify(data));
      for (const row of data.split('\r\n')) {
        if (!_.isNil(row) && !_.isEmpty(row)) {
          // console.log('data1:' + JSON.stringify(row.split('\t')[0]));
          // console.log('data2:' + JSON.stringify(row.split('\t')[1]));
          // console.log('data3:' + JSON.stringify(row.split('\t')[2]));
          // console.log('data4:' + JSON.stringify(row.split('\t')[3]));
          // item.barcode,
          // item.name,
          // item.author,
          // item.date,
          // item.cate,
          // item.image
          await addbook({
            barcode: row.split(',')[0],
            name: row.split(',')[1],
            author: row.split(',')[2],
            date: row.split(',')[3],
            cate: row.split(',')[4],
            image: ''
          });
        }
      }
      ToastAndroid.showWithGravity('インポート処理が完了ました。', ToastAndroid.SHORT, ToastAndroid.TOP);
    } else {
      Alert.alert(
        'エラー',
        "インポート処理が失敗しました。もう一回試してください。",
        [
          { text: 'OK' }
        ],
        { cancelable: false },
      );
    }
  }
  _export = async () => {
    const list = await getbooklist();
    let txt = this.generate_bookcsv(list);
    const tempFileDirectory = `${FileSystem.documentDirectory}bookcsv`;
    await FileSystem.makeDirectoryAsync(tempFileDirectory, { intermediates: true });
    const tempFilePath = `${tempFileDirectory}/${'bookdata_' + this.getDateNowEX()}.csv`;
    await FileSystem.writeAsStringAsync(tempFilePath, txt, { encoding: FileSystem.EncodingType.UTF8 });

    if ((await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(tempFilePath)
      ToastAndroid.showWithGravity('エクスポート処理が完了ました。', ToastAndroid.SHORT, ToastAndroid.TOP);
    }
  }
  generate_bookcsv = (list) => {
    let str = '';
    let line = '';
    _.forEach(list, (item) => {
      line = item.barcode + ',' + item.name + ',' + item.author + ',' + item.date + ',' + item.cate
      str += line + '\r\n';
    })
    return str;
  }
  getDateNowEX = () => {
    let dt = new Date();
    let y = ("" + dt.getFullYear()).slice(-2);
    let m = ("00" + (dt.getMonth() + 1)).slice(-2);
    let d = ("00" + dt.getDate()).slice(-2);
    let h = ("00" + dt.getHours()).slice(-2);
    let mi = ("00" + dt.getMinutes()).slice(-2);
    let s = ("00" + dt.getSeconds()).slice(-2);
    var result = y + "" + m + "" + d + "-" + h + "" + mi + "" + s;
    return result;
  }
}

const styles = StyleSheet.create(
  {
    buttonContainer: {
      height: 60,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "stretch",
    },
    button: {
      height: 50,
      backgroundColor: COLORS.main,
      borderWidth: 0,
      borderRadius: 0,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
      marginLeft: 5,
      marginRight: 5,
    },
    buttonText: {
      color: COLORS.white,
      fontSize: 15,
      fontWeight: 'bold'
    },
  }
)