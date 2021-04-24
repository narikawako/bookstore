import React from 'react';
import { TouchableOpacity, View, TextInput, Text, Alert, BackHandler, ToastAndroid, Image } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import _ from 'lodash';
//本地库处理
import { addbook, updatebook, deletebook } from '../05dbprovider/DBAction4Book'
//常量
import { COLORS, CommonStyles, DEVICE_BACK_ACTION, _formatDate, BOOKSIMAGEFOLDER, FONTSIZE, getDateNowEX } from '../const'
//数据流
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { book_additem_action, book_updateitem_action, book_deleteitem_action, book_loadcurritem_action } from '../04action/index'
//其他插件
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';

//DB字段：

// id: '',
// name: '',
// barcode: '',
// author: '',
// date: '',
// cate: '',
// image: ''

class BookItem extends React.Component {
  constructor(props) {
    super(props);
    //页面上要操作的6个书籍的属性，以及扫描条形码的标志位，还有显示日付输入框的标志位
    this.state = { date: new Date(), cate: "", barcode: "", author: "", name: "", image: "", showdate: false, showscanner: false, scanned: false };
  }
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: () => (
        <View>
          <Text style={CommonStyles.headerTitle}>{'ブック明細'}</Text>
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
        <TouchableOpacity onPress={() => params.save()} style={CommonStyles.headerButtonRight}>
          <Text style={CommonStyles.headerButtonText}>{"保存 >"}</Text>
        </TouchableOpacity>
      ),
    };
  };
  render() {
    //给用户一个取消的机会
    const scanntext = this.state.showscanner ? '取消' : 'スキャン'

    return (
      <ScrollView>
        <View style={CommonStyles.container}>
          <NavigationEvents onDidFocus={this._ondidfocus} />

          <View style={CommonStyles.labelContainer}>
            <Text style={CommonStyles.label}>{'コード：'}</Text>
          </View>
          <View style={CommonStyles.inputContainer}>
            <TextInput style={[CommonStyles.input, { backgroundColor: COLORS.border, borderColor: '#a6a6a6', borderWidth: 1 }]} placeholder="" onChangeText={(text) => this.setState({ barcode: text })} value={this.state.barcode} editable={false} />
            <View style={CommonStyles.scanbuttonContainer}>
              <TouchableOpacity onPress={this._scanbarcode} style={CommonStyles.button}>
                <Text style={CommonStyles.buttonText}>{scanntext}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {
            this.state.showscanner === true &&
            <View style={CommonStyles.scannerContainer}>
              <Camera
                onBarCodeScanned={this.state.scanned ? undefined : this.handleBarCodeScanned}
                style={CommonStyles.scanView}
              />
            </View>
          }

          <View style={CommonStyles.labelContainer}>
            <Text style={CommonStyles.label}>{'名称：'}</Text>
          </View>
          <View style={CommonStyles.inputContainer}>
            <TextInput style={CommonStyles.input} placeholder="" onChangeText={(text) => this.setState({ name: text })} value={this.state.name} />
          </View>

          <View style={CommonStyles.labelContainer}>
            <Text style={CommonStyles.label}>{'著者：'}</Text>
          </View>
          <View style={CommonStyles.inputContainer}>
            <TextInput style={CommonStyles.input} placeholder="" onChangeText={(text) => this.setState({ author: text })} value={this.state.author} />
          </View>

          <View style={CommonStyles.labelContainer}>
            <Text style={CommonStyles.label}>{'購入日付：'}</Text>
          </View>
          <View style={CommonStyles.dateContainer}>
            <TouchableOpacity onPress={this._onselectDate} style={CommonStyles.dateArea}>
              <Text style={CommonStyles.dateAreaText}>{_formatDate(this.state.date)}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={this.state.showdate}
              mode="date"
              date={new Date(this.state.date)}
              locale="ja"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              headerTextIOS="日付指定"
              cancelTextIOS="キャンセル"
              confirmTextIOS="ＯＫ"
              onConfirm={this._handleConfirm}
              onCancel={this._hideDatePicker}
            />
          </View>

          <View style={CommonStyles.labelContainer}>
            <Text style={CommonStyles.label}>{'分類：'}</Text>
          </View>
          <View style={CommonStyles.inputContainer}>
            <TextInput style={CommonStyles.input} placeholder="" onChangeText={(text) => this.setState({ cate: text })} value={this.state.cate} />
            <View style={CommonStyles.scanbuttonContainer}>
              <TouchableOpacity onPress={this._selectcate} style={CommonStyles.button}>
                <Text style={CommonStyles.buttonText}>{'選択…'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={CommonStyles.labelContainer}>
            <Text style={CommonStyles.label}>{'画像：'}</Text>
          </View>
          <View style={CommonStyles.imgContainer}>
            {
              (!_.isNil(this.state.image) && !_.isEmpty(this.state.image)) ?
                <Image
                  style={CommonStyles.img}
                  source={{ uri: this.state.image }}
                />
                :
                <Image
                  style={CommonStyles.img}
                  source={require('../assets/empty.png')}
                />
            }
          </View>
          <View style={CommonStyles.doublebuttonContainer}>
            <TouchableOpacity onPress={this._takephoto} style={CommonStyles.button}>
              <Text style={CommonStyles.buttonText}>{"カメラ"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._selectpicture} style={CommonStyles.button}>
              <Text style={CommonStyles.buttonText}>{"写真"}</Text>
            </TouchableOpacity>
          </View>

          {this.props.bookitem.id !== '' &&
            <View style={CommonStyles.buttonContainer}>
              <TouchableOpacity onPress={this._delete} style={CommonStyles.buttoncommon}>
                <Text style={CommonStyles.buttonText}>{'削除'}</Text>
              </TouchableOpacity>
            </View>
          }

        </View>
      </ScrollView>
    );
  }

  _takephoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, //允许编辑
      aspect: [1, 1], //编辑框大小
      quality: 1, //图片质量
      base64: false
    });
    if (!result.cancelled) {
      //state里面暂时存储cache里的图片uri，这个位置在imagepicker目录下
      this.setState({ image: result.uri });
    }
  };
  _selectpicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, //允许编辑
      aspect: [1, 1], //编辑框大小
      quality: 1, //图片质量
      base64: false
    });
    if (!result.cancelled) {
      //state里面暂时存储cache里的图片uri，这个位置在imagepicker目录下
      this.setState({ image: result.uri });
    }
  };

  _scanbarcode = () => {
    if (this.state.showscanner === true) {
      //scanned的含义是扫描到了东西了，要停止扫描
      this.setState({ scanned: true, showscanner: false });
    } else {
      this.setState({ scanned: false, showscanner: true });
    }
  };
  handleBarCodeScanned = async ({ type, data }) => {
    this.setState({ scanned: true, barcode: data, showscanner: false });
  };

  _selectcate = () => {
    const newitem = {
      id: '',
      date: this.state.date,
      cate: this.state.cate,
      name: this.state.name,
      author: this.state.author,
      barcode: this.state.barcode,
      image: this.state.image
    }
    newitem.id = this.props.bookitem.id;
    //离开画面时要把画面数据保存到全局state
    this.props.book_loadcurritem_action(newitem)
    this.props.navigation.navigate('bookcatelist');
  }

  //选择日付
  _onselectDate = () => {
    this.setState({ showdate: true });
  }
  _handleConfirm = (date) => {
    this.setState({ date: date, showdate: false });
  }
  _hideDatePicker = () => {
    this.setState({ showdate: false });
  }

  _cancel = () => {
    this.props.navigation.goBack();
    return true;
  };
  _delete = () => {
    Alert.alert(
      '削除',
      'このブックを削除します。よろしいでしょうか',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'OK', onPress: this._deleteaction
        }
      ],
      { cancelable: false },
    )
  };
  _deleteaction = async () => {
    await deletebook(this.props.bookitem.id)
    this.props.book_deleteitem_action(this.props.bookitem.id);
    ToastAndroid.showWithGravity('ブックの削除処理が完了ました。', ToastAndroid.SHORT, ToastAndroid.TOP);
    this.props.navigation.goBack();
  }
  _save = async () => {
    let inputError = false;
    if (_.isNil(this.state.cate) || _.isEmpty(this.state.cate)) inputError = true;
    if (_.isNil(this.state.name) || _.isEmpty(this.state.name)) inputError = true;
    if (inputError === true) {
      Alert.alert(
        'エラー',
        "分類もしくは名称は未入力なので、保存できません。",
        [
          { text: 'OK' }
        ],
        { cancelable: false },
      );
      return;
    }
    let bookdata = {
      date: _formatDate(this.state.date),
      cate: this.state.cate,
      name: this.state.name,
      author: this.state.author,
      barcode: this.state.barcode,
    }

    console.log('bookdata:' + JSON.stringify(bookdata));

    if (_.isNil(this.state.image) || _.isEmpty(this.state.image)) {
      console.log('无图片信息');
      bookdata.image = '';
    } else {
      console.log('有图片信息，开始保存图片');
      //在用户目录下创建商品图片的保存目录：file:///data/user/0/host.exp.exponent/files/ExperienceData/%2540cheney%252Fbookstore/booksimages
      const tempFileDirectory = `${FileSystem.documentDirectory}booksimages`;
      await FileSystem.makeDirectoryAsync(tempFileDirectory, { intermediates: true });
      console.log('创建的目录为：' + tempFileDirectory);
      //在目录下创建文件：file:///data/user/0/host.exp.exponent/files/ExperienceData/%2540cheney%252Fwarehouse/goodsimages/20201102121214.jpeg
      const imagename = getDateNowEX() + '.jpeg';
      const tempFilePath = `${tempFileDirectory}/${imagename}`;
      console.log('将要创建的文件名为：' + tempFilePath);
      await FileSystem.copyAsync({ from: this.state.image, to: tempFilePath })
      console.log('文件创建成功：' + imagename);
      //将这个文件名存储到DB
      bookdata.image = imagename;
    }

    //console.log('bookdata:' + JSON.stringify(bookdata));

    const isedit = this.props.bookitem.id !== ''
    if (isedit) {
      bookdata.id = this.props.bookitem.id;
      console.log('id:' + JSON.stringify(this.props.bookitem.id));
      console.log('data0:' + JSON.stringify(bookdata));
      await updatebook(bookdata)
      this.props.book_updateitem_action(bookdata);
      ToastAndroid.showWithGravity('ブックの変更処理が完了ました。', ToastAndroid.SHORT, ToastAndroid.TOP);
    } else {
      console.log('data1:' + JSON.stringify(bookdata));
      const newid = await addbook(bookdata);
      bookdata.id = newid;
      this.props.book_additem_action(bookdata);
      ToastAndroid.showWithGravity('ブックの新規処理が完了ました。', ToastAndroid.SHORT, ToastAndroid.TOP);
    }
    this.props.navigation.goBack();
  };

  _ondidfocus = async () => {
    const response1 = await Permissions.askAsync(Permissions.CAMERA);
    console.log('申请相机权限CAMERA的结果是：' + response1.status + '/' + response1.expires + '/' + response1.canAskAgain);
    const response2 = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    console.log('申请相机权限MEDIA_LIBRARY的结果是：' + response2.status + '/' + response2.expires + '/' + response2.canAskAgain);

    BackHandler.addEventListener(DEVICE_BACK_ACTION, this._cancel);
    this.props.navigation.setParams({ cancel: this._cancel });
    this.props.navigation.setParams({ save: this._save });
    if (!_.isNil(this.props.bookitem)) {
      this.setState({
        date: this.props.bookitem.date,
        cate: this.props.bookitem.cate,
        name: this.props.bookitem.name,
        author: this.props.bookitem.author,
        barcode: this.props.bookitem.barcode,
        image: _.isEmpty(this.props.bookitem.image) ? '' : BOOKSIMAGEFOLDER + this.props.bookitem.image
      });
    }
  };
  componentWillUnmount = () => {
    BackHandler.removeEventListener(DEVICE_BACK_ACTION, this._cancel);
  }
}

const mapStateToProps = (state) => {
  //这个组件订阅的数据
  return {
    bookitem: state.book.currbookitem
  };
}

const mapDispatchToProps = (dispatch) => {
  //这个组件需要更新全局state的信息
  return bindActionCreators({ book_additem_action, book_updateitem_action, book_deleteitem_action, book_loadcurritem_action }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BookItem);