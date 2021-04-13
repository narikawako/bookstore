import React from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from "lodash";
export default class Switch extends React.Component {
  constructor(props) {
    super(props);
    this.silenceLogin();
  }
  silenceLogin = async () => {
    const LastLoginDatetime = await AsyncStorage.getItem('LastLoginDatetime');
    if (_.isNil(LastLoginDatetime)) {
      //还没有登陆过，那么得登录一次
      this.props.navigation.navigate('LoginStackPage');
    } else {
      //登录过了，那么看是否过期,如果小于24小时，则跳过登录逻辑，如果超过24小时，则必须登录
      var diff = Math.abs(Date.now() - parseInt(LastLoginDatetime)) / 3600000;
      if (diff < 24) {
        this.props.navigation.navigate('AppStackPage');
      } else {
        await AsyncStorage.removeItem('LastLoginDatetime');
        this.props.navigation.navigate('LoginStackPage');
      }
    }
  }
  render() {
    return (
      <View></View>
    );
  }
}