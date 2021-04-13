import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Image } from 'react-native';
import _ from 'lodash';
import { COLORS, CommonStyles } from '../const';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: () => (
        <View>
          <Text style={CommonStyles.headerTitle}>{'ミニ本屋'}</Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: COLORS.main,
      },
      headerLeft: () => (
        <TouchableOpacity onPress={() => params.logout()} style={CommonStyles.headerButtonLeft}>
          <Text style={CommonStyles.headerButtonText}>{"< ﾛｸﾞｱｳﾄ"}</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => params.modifyPWD()} style={CommonStyles.headerButtonRight}>
          <Text style={CommonStyles.headerButtonText}>{"ﾊﾟｽﾜｰﾄﾞ変更 >"}</Text>
        </TouchableOpacity>
      ),
    };
  };

  render() {
    return (
      <View style={CommonStyles.container}>
        <View style={styles.containerRow}>
          <View style={styles.containerBig}>
            <TouchableOpacity onPress={this._tocash} style={styles.buttonBig}>
              <Image
                style={styles.imgBig}
                source={require('../assets/books-64.png')}
              />
              <Text style={styles.buttonTextBig}>{"ブックリスト"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  _logout = async () => {
    await AsyncStorage.removeItem('LastLoginDatetime');
    this.props.navigation.navigate('LoginStackPage');
  };
  _modifyPWD = () => {
    this.props.navigation.navigate('modifypwd');
  };
  _tocash = () => {
    //this.props.navigation.navigate('cashbook');
  };
  
  componentDidMount() {
    this.props.navigation.setParams({ logout: this._logout });
    this.props.navigation.setParams({ modifyPWD: this._modifyPWD });
  }
}
const styles = StyleSheet.create(
  {
    containerRow: {
      flexDirection: "row",
      flexWrap: "nowrap",
      justifyContent: "space-between",
      alignItems: "flex-start",
      alignContent: "flex-start",
      paddingTop: 5,
      paddingBottom: 0
    },
    containerBig: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      alignContent: "flex-start",
      width: 120,
      height: 120,
      padding: 1,
      borderColor: COLORS.main,
      borderWidth: 1,
      borderRadius: 0,
    },
    buttonBig: {
      backgroundColor: COLORS.main,
      borderWidth: 0,
      borderRadius: 0,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: 116,
      height: 116
    },
    buttonTextBig: {
      color: COLORS.white,
      fontSize: 15
    },
    imgBig: {
      width: 64,
      height: 64,
      marginBottom: 10
    }
  }
)