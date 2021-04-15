//import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { TouchableOpacity, View, TextInput, StyleSheet, Text, Alert, ToastAndroid } from 'react-native';
import { COLORS, CommonStyles } from '../const'
import _ from 'lodash';
import { login } from '../05dbprovider/DBAction4Common';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { password: "" };
  }
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: () => (
        <View>
          <Text style={CommonStyles.headerTitle}>{'ミニ本屋へようこそ！'}</Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: COLORS.main,
      },
      headerLeft: () => (
        <TouchableOpacity >
          <Text>{""}</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => params.login()} style={CommonStyles.headerButtonRight}>
          <Text style={CommonStyles.headerButtonText}>{"ログイン"}</Text>
        </TouchableOpacity>
      ),
    };
  };
  render() {
    return (
      <View style={CommonStyles.container}>
        <View style={CommonStyles.labelContainer}>
          <Text style={CommonStyles.label}>{'パスワード：'}</Text>
        </View>
        <View style={CommonStyles.inputContainer}>
          <TextInput style={CommonStyles.input} secureTextEntry={true} onChangeText={(text) => this.setState({ password: text })} value={this.state.password} />
        </View>
        <View style={CommonStyles.footerContainer}>
          <View style={CommonStyles.footer}>
            <Text style={CommonStyles.footerTitle}>
              {"Version: 1.0.1(20210413)"}
            </Text>
          </View>
        </View>
      </View>
    );
  }


  _login = async () => {
    //Login前先验证是否有空数据
    let inputError = false;
    if (_.isNil(this.state.password) || _.isEmpty(this.state.password)) inputError = true;
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

    let result = await login(_.trim(this.state.password));
    if (result === true) {
      await AsyncStorage.setItem('LastLoginDatetime', Date.now().toString());
      ToastAndroid.showWithGravity('ログインできました。', ToastAndroid.SHORT, ToastAndroid.TOP);
      this.props.navigation.navigate('AppStackPage');
    } else {
      await AsyncStorage.removeItem('LastLoginDatetime');
      Alert.alert(
        'エラー',
        "パスワードは不正なので、ログインできません。",
        [
          { text: 'OK' }
        ],
        { cancelable: false },
      );
    }
  };
  componentDidMount() {
    this.props.navigation.setParams({ login: this._login });
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
