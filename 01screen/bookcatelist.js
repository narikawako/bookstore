import _ from 'lodash';
import React from 'react';
import { View, FlatList, Text, ActivityIndicator, BackHandler, TouchableOpacity } from 'react-native';
//react-navigation对页面的跳转会有缓存，A跳到B再退回到A的时候，不一定会调起Componentdidmount等生命周期方法，所以需要使用如下组件可以触发生命周期
import { NavigationEvents } from 'react-navigation';
//数据流
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//常量
import { COLORS, CommonStyles, DEVICE_BACK_ACTION, FONTSIZE } from '../const';
//对本地数据库的操作
import { getbookcatelist } from '../05dbprovider/DBAction4Book';
import { book_updatecate_action } from '../04action/index'
import CateRenderItem from '../01screen/component/caterenderitem'

//选择模式下要为三个疾病选择数据

class CateList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { catelist: [] };
  }
  static navigationOptions = ({ navigation }) => {
    //导航中的按钮需要通过入口参数传入
    const { params = {} } = navigation.state;
    return {
      headerTitle: () => (
        <View>
          <Text style={CommonStyles.headerTitle}>{'分類リスト'}</Text>
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
        <View>
        </View>
      ),
    };
  };
  render() {
    if (_.isNil(this.state.catelist)) {
      return (
        <View>
          <NavigationEvents onDidFocus={this._ondidfocus} />
          <ActivityIndicator size="large" color={COLORS.main} style={{ paddingTop: 200 }} animating={true} />
        </View>
      )
    }
    if (!_.isNil(this.state.catelist) && _.isEmpty(this.state.catelist)) {
      return (
        <View style={CommonStyles.container}>
          <NavigationEvents onDidFocus={this._ondidfocus} />
          <View style={CommonStyles.emptyContainer}>
            <Text style={CommonStyles.emptyTitleContent}>{"データはありません。"}
            </Text>
          </View>
        </View>
      )
    }
    return (
      <View style={CommonStyles.container}>
        <NavigationEvents onDidFocus={this._ondidfocus} />
        <FlatList style={CommonStyles.flatList}
          data={this.state.catelist}
          renderItem={this._renderItem}
          onRefresh={() => this._onRefresh()}
          refreshing={false}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 5, paddingTop: 5 }}
        />
      </View>
    );
  }
  _renderItem = ({ item }) => (
    <CateRenderItem
      id={item.cate}
      key={item.cate}
      name={item.cate}
      ondetailpress={this._onDetailPress}
    />
  );
  _onDetailPress = (name) => {
    this.props.book_updatecate_action(name);
    this.props.navigation.goBack();
  };
  _cancel = () => {
    this.props.navigation.goBack();
    return true;
  };

  //生命周期函数，每次进入这个画面都会触发
  _ondidfocus = async () => {
    BackHandler.addEventListener(DEVICE_BACK_ACTION, this._cancel);
    //传递导航栏的两个按钮的响应函数
    this.props.navigation.setParams({ cancel: this._cancel });
    let dblist = await getbookcatelist();
    this.setState({ catelist: dblist });
  };
  componentWillUnmount = () => {
    BackHandler.removeEventListener(DEVICE_BACK_ACTION, this._cancel);
  }
  _onRefresh = async () => {
    let dblist = await getbookcatelist();
    this.setState({ catelist: dblist });
  }

}

const mapStateToProps = (state) => {
  //这个组件订阅的数据
  return {
  };
}
const mapDispatchToProps = (dispatch) => {
  //这个组件需要更新全局state的信息
  return bindActionCreators({ book_updatecate_action }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(CateList);
