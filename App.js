import React from 'react';
//导航
import 'react-native-gesture-handler';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import  AppStack  from './02navigation/appstack';
import  LoginStack  from './02navigation/loginstack';
import  Switch  from './02navigation/switch';
//数据流
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './03reducer/index';

//导航处理：SwitchPage判定是否已经有登录情报，实施跳转
const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      SwitchPage: Switch,
      AppStackPage: AppStack,
      LoginStackPage: LoginStack,
    },
    {
      initialRouteName: 'SwitchPage',
    }
  )
);
export default class App extends React.Component {
  render() {
    return (
      //数据流处理：通过Provider和createStore将全局的state绑定到组件
      <Provider store={createStore(reducer)}>
        <AppContainer />
      </Provider>
    );
  }
}