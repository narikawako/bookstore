import React from 'react';
import { TouchableOpacity, View, TextInput, StyleSheet, Text, Alert, BackHandler, ToastAndroid } from 'react-native';
//react-navigation对页面的跳转会有缓存，A跳到B再退回到A的时候，不一定会调起Componentdidmount等生命周期方法，所以需要使用如下组件可以触发生命周期
import { NavigationEvents } from 'react-navigation';
import _ from 'lodash';
//import { updatepwd } from '../dbproviders/DBAction4Common';
import { COLORS, CommonStyles, DEVICE_BACK_ACTION } from '../const'


export default class MofifyPWD extends React.Component {
  constructor(props) {
    super(props);
    this.state = { password1: "", password2: "" };
  }
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: () => (
        <View>
          <Text style={CommonStyles.headerTitle}>{'パスワード変更'}</Text>
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
    return (
      <View style={CommonStyles.container}>
        <NavigationEvents onDidFocus={this._ondidfocus} />
        <View style={CommonStyles.labelContainer}>
          <Text style={CommonStyles.label}>{'新パスワード：'}</Text>
        </View>
        <View style={CommonStyles.inputContainer}>
          <TextInput style={CommonStyles.input} secureTextEntry={true} onChangeText={(text) => this.setState({ password1: text })} value={this.state.password1} />
        </View>
        <View style={CommonStyles.labelContainer}>
          <Text style={CommonStyles.label}>{'新パスワード（確認）：'}</Text>
        </View>
        <View style={CommonStyles.inputContainer}>
          <TextInput style={CommonStyles.input} secureTextEntry={true} onChangeText={(text) => this.setState({ password2: text })} value={this.state.password2} />
        </View>
      </View>
    );
  }
  _cancel = () => {
    this.props.navigation.goBack();
    return true;
  };
  _save = async () => {
    let inputError = false;
    if (_.isNil(this.state.password1) || _.isEmpty(this.state.password1)) inputError = true;
    if (_.isNil(this.state.password2) || _.isEmpty(this.state.password2)) inputError = true;
    if (inputError === true) {
      Alert.alert(
        'エラー',
        "パスワードを入力してください。",
        [
          { text: 'OK' }
        ],
        { cancelable: false },
      );
      return;
    }
    if (this.state.password1 !== this.state.password2) {
      Alert.alert(
        'エラー',
        "新パスワードと新パスワード（確認）は不一致なので、保存できません。",
        [
          { text: 'OK' }
        ],
        { cancelable: false },
      );
      return;
    }

    let result = true; //await updatepwd(this.state.password1);
    if (result === true) {
      ToastAndroid.showWithGravity('パスワードを変更できました。', ToastAndroid.SHORT, ToastAndroid.TOP);
      this.props.navigation.navigate('home');
    } else {
      Alert.alert(
        'エラー',
        "エラーが発生しました。もう一回試してください",
        [
          { text: 'OK' }
        ],
        { cancelable: false },
      );

    }
  };
  _ondidfocus = async () => {
    BackHandler.addEventListener(DEVICE_BACK_ACTION, this._cancel);
    this.props.navigation.setParams({ cancel: this._cancel });
    this.props.navigation.setParams({ save: this._save });
  }
  componentWillUnmount = () => {
    BackHandler.removeEventListener(DEVICE_BACK_ACTION, this._cancel);
  }
}

const styles = StyleSheet.create(
  {
    inputContainer: {
      height: 60,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "stretch"
    },
    input: {
      fontWeight: 'bold',
      height: 50,
      borderColor: COLORS.border,
      borderWidth: 1,
      borderRadius: 0,
      backgroundColor: COLORS.white,
      paddingRight: 10,
      paddingLeft: 10,
      paddingTop: 5,
      paddingBottom: 5,
      marginTop: 10,
      marginLeft: 5,
      marginRight: 5,
      fontSize: 15
    },
  }
)