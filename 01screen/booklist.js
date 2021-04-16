import _ from 'lodash';
import React from 'react';
import { View, FlatList, Text, TextInput, ActivityIndicator, BackHandler, TouchableOpacity } from 'react-native';
//react-navigation对页面的跳转会有缓存，A跳到B再退回到A的时候，不一定会调起Componentdidmount等生命周期方法，所以需要使用如下组件刻意触发生命周期
import { NavigationEvents } from 'react-navigation';
//数据流
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { book_loadcurritem_action, book_loadlist_action, book_clearlist_action } from '../04action/index'
//常量
import { COLORS, CommonStyles, DEVICE_BACK_ACTION, FONTSIZE} from '../const';
//本地DB
import { getbooklist, getbookcatelist } from '../05dbprovider/DBAction4Book';
//子组件
import BookRenderItem from '../01screen/component/bookrenderitem'
//其他插件
import { Picker } from '@react-native-picker/picker'
import { Camera } from 'expo-camera';

class BookList extends React.Component {
  constructor(props) {
    super(props);
    //这个画面的数据源：书籍列表全集，过滤后的子集，分类列表全集，选中的分类，关键字。
    //书籍全集由Redux数据源提供，因为书籍列表，新规编辑画面都会涉及这个全集，所以需要redux全集管理。
    //子集和选中的分类，关键字因为仅仅在页面内有意义，不需要其他页面共用，所以用页面内State管理。
    //分类全集可以在Redux里面管理，也可以在页面内管理，要比较两个的复杂度。
    //如果在Redux里面管理，就需要在每次增删改书籍的时候，维护这个全局变量。
    //如果是在页面内通过State管理的话，每次进入页面都要从数据库拿最新的分类全集。
    //因为这个例子使用的是本地库，每次及时获取不会有太大的性能损失，所以可以用页面State管理
    this.state = { sublist: [], keywords: '', cate: '', catelist: null, showscanner: false, scanned: false };
    //showscanner和scanned是扫描条形码功能使用的标签位。
  }
  static navigationOptions = ({ navigation }) => {
    //导航中的按钮需要通过入口参数传入
    const { params = {} } = navigation.state;
    return {
      headerTitle: () => (
        <View>
          <Text style={CommonStyles.headerTitle}>{'ブック一覧'}</Text>
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
        <TouchableOpacity onPress={() => params.add()} style={CommonStyles.headerButtonRight}>
          <Text style={CommonStyles.headerButtonText}>{"新規 >"}</Text>
        </TouchableOpacity>
      ),
    };
  };
  render() {

    //页面能展示出来的前提是书籍列表不能为null，并且分类的全集不能为null（null和[]不一样，空数组表示对象不为空，仅仅元素个数为0而已）
    if (_.isNil(this.props.booklist) || _.isNil(this.state.catelist)) {
      return (
        <View>
          <NavigationEvents onDidFocus={this._ondidfocus} />
          <ActivityIndicator size="large" color={COLORS.main} style={{ paddingTop: 200 }} animating={true} />
        </View>
      )
    }

    //确实无数据
    if (!_.isNil(this.props.booklist) && _.isEmpty(this.props.booklist)) {
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

    //分类全集的整理
    let cateItems = [];
    cateItems.push(<Picker.Item key={0} value={''} label={'すべて'} />)
    let catesubitems = this.state.catelist.map((s, i) => {
      return <Picker.Item key={i} value={s.cate} label={s.cate} />
    });
    cateItems.push(catesubitems);
    
    //扫描标签位的应用
    const scanntext = this.state.showscanner ? '取消' : 'ｽｷｬﾝ'

    //渲染
    return (
      <View style={[CommonStyles.container, { padding: 0 }]}>
        <NavigationEvents onDidFocus={this._ondidfocus} />
        <View style={[CommonStyles.searchContainer, { marginTop: 5, marginLeft: 5, marginRight: 5, marginBottom: 5 }]}>
          <View style={[CommonStyles.combocontainer, { flex: 2 }]}>
            <Picker selectedValue={this.state.cate} style={CommonStyles.combo} onValueChange={this._catechanged}>
              {cateItems}
            </Picker>
          </View>
          <View style={[{ flex: 3, height: 50, marginLeft: 3 }]}>
            <TextInput style={[CommonStyles.input, { fontSize: FONTSIZE.small }]} placeholder="キーワード" onChangeText={this._keywordschanged} value={this.state.keywords} />
          </View>
          <TouchableOpacity onPress={this._scanbarcode} style={[CommonStyles.listScanButton, { height: 50, flex: 1, marginLeft: 3, textAlign: 'center', fontSize: FONTSIZE.small }]}>
            <Text style={CommonStyles.buttonText}>{scanntext}</Text>
          </TouchableOpacity>
          <View style={[{ height: 50, flex: 1, marginLeft: 3 }]}>
            <Text style={[CommonStyles.text, { textAlign: 'center', fontSize: FONTSIZE.small }]} >{this.state.sublist.length + ' 件'}</Text>
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
        <FlatList style={[CommonStyles.flatList, { marginTop: 5, marginLeft: 5, marginRight: 5, marginBottom: 5 }]}
          data={this.state.sublist}
          renderItem={this._renderItem}
          onRefresh={() => this._onRefresh()}
          refreshing={false}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 0, paddingTop: 5 }}
        />
      </View>
    );
  }
  _renderItem = ({ item }) => (
    <BookRenderItem
      id={item.id}
      key={item.id}
      bookrenderitem={item}
      ondetailpress={this._onDetailPress}
    />
  );
  _scanbarcode = () => {
    if (this.state.showscanner === true) {
      //scanned的含义是扫描到了东西了，要停止扫描
      this.setState({ scanned: true, showscanner: false });
    } else {
      this.setState({ scanned: false, showscanner: true });
    }
  };
  handleBarCodeScanned = async ({ type, data }) => {
    this.setState({
      scanned: true,
      keywords: data,
      showscanner: false,
      sublist: this._filterdata(data, this.state.cate)
    });
  };
  _catechanged = (text) => {
    this.setState({
      cate: text,
      sublist: this._filterdata(this.state.keywords, text)
    })
  }
  _keywordschanged = (text) => {
    this.setState({
      keywords: text,
      sublist: this._filterdata(text, this.state.cate)
    });
  }
  _filterdata = (keyword, cate) => {
    let filterdata = this.props.booklist;
    if (keyword !== '') {
      filterdata = _.filter(filterdata, (item) => { return (_.includes(item.name, keyword) || item.barcode === keyword) })
    }
    if (cate !== '') {
      filterdata = _.filter(filterdata, (item) => { return item.cate === cate })
    }
    return filterdata;
  }

  //查看详细
  _onDetailPress = (bookitem) => {
    //设定当前修改的元素，然后进入修改页面
    this.props.book_loadcurritem_action(bookitem)
    this.props.navigation.navigate('bookitem');
  };

  //新规操作
  _add = () => {
    const newitem = {
      id: '',
      date: new Date(),
      cate: '',
      name: '',
      author: '',
      barcode: '',
      image: '',
    }
    this.props.book_loadcurritem_action(newitem)
    this.props.navigation.navigate('bookitem');
  }

  _cancel = () => {
    //离开这个画面的时候清空redux中的数据，给用户留一个机会，万一redux数据异常，可以通过退回主画面后再进入的方式修复。
    this.props.book_clearlist_action();
    this.props.navigation.goBack();
    return true;
  };

  //从数据库获取数据，然后更新redux全局变量
  _fetchData = async () => {
    let dblist = await getbooklist();
    if (!_.isNil(dblist)) {
      this.props.book_loadlist_action(dblist);
    } else {
      this.props.book_loadlist_action([]);
    }
  }

  //生命周期函数，每次进入这个画面都会触发
  _ondidfocus = async () => {

    //安卓返回按键的处理
    BackHandler.addEventListener(DEVICE_BACK_ACTION, this._cancel);

    //传递导航栏的两个按钮的响应函数
    this.props.navigation.setParams({ cancel: this._cancel });
    this.props.navigation.setParams({ add: this._add });

    //第一次获取书籍列表数据
    if (_.isNil(this.props.booklist)) {
      await this._fetchData();
    }

    //每次都要获取分类全集数据
    let allcate = await getbookcatelist();

    this.setState({
      sublist: this.props.booklist,
      keywords: '',
      cate: '',
      catelist: allcate,
    });

  };

  componentWillUnmount = () => {
    BackHandler.removeEventListener(DEVICE_BACK_ACTION, this._cancel);
  }

  _onRefresh = async () => {
    await this._fetchData();
    this.setState({ sublist: this._filterdata(this.state.keywords, this.state.cate) });
  }

}

const mapStateToProps = (state) => {
  //这个组件订阅的数据:言外之意，只要Redux里面的booklist发生改变，这个画面立即重新渲染
  return {
    booklist: state.book.booklist
  };
}

const mapDispatchToProps = (dispatch) => {
  //这个组件需要更新Redux的信息（通过哪些Action去更新？）
  return bindActionCreators({ book_loadcurritem_action, book_loadlist_action, book_clearlist_action }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BookList);
