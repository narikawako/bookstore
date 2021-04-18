import React from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from "lodash";
import * as SQLite from 'expo-sqlite';
const DB = SQLite.openDatabase('db');

export default class Switch extends React.Component {
  constructor(props) {
    super(props);
    console.log('APP进入分支页');
    this.prepareDB();
    this.silenceLogin();
  }
  prepareDB = () => {

    DB.transaction(tx => {

      // tx.executeSql(
      //   'drop table book;',
      //   null,
      //   () => { console.log('删除book表成功') },
      //   (_, error) => { console.log('删除book表失败:' + error) }
      // );

      // tx.executeSql(
      //   'drop table setting;',
      //   null,
      //   () => { console.log('删除setting表成功') },
      //   (_, error) => { console.log('删除setting表失败:' + error) }
      // );


      tx.executeSql(
        'create table if not exists book (' +

        'id integer primary key AUTOINCREMENT,' +

        'barcode text,' +            //条形码
        'name text,' +               //书名
        'author text,' +             //作者
        'date text,' +               //购买日期
        'cate text,' +               //分类
        'image text' +               //图片
        ');',
        null,
        () => { console.log('创建book表成功') },
        (_, error) => { console.log('创建book表失败:' + error) }
      );

      tx.executeSql(
        'create table if not exists setting (' +
        'key text primary key,' +
        'value text' +
        ');',
        null,
        () => { console.log('创建setting表成功') },
        (_, error) => { console.log('创建setting表失败:' + error) }
      );

      tx.executeSql(
        `insert or ignore into setting (key,value) values (?,?);`,
        ['pwd', '123qwe'],
        () => { console.log('插入setting默认数据成功') },
        (_, error) => { console.log('插入setting默认数据失败:' + error) }
      );
    },
      () => { console.log('创建表过程失败') },
      () => { console.log('创建表过程成功') }
    );
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