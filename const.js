import { StyleSheet, Dimensions } from 'react-native';
import * as FileSystem from 'expo-file-system';

export const DEVICE_BACK_ACTION = 'hardwareBackPress';

//书籍图片的保存位置
export const BOOKSIMAGEFOLDER = `${FileSystem.documentDirectory}booksimages/`;

//字体设定
export const FONTSIZE = {
  default: 18,
  big: 20,
  small: 16,
  tiny: 10
}

//系统的主色调
export const COLORS = {
  main: '#4d99cc',
  sub: '#16a9c7',
  back: '#f0f0f0',
  border: '#cccccc',
  gray: '#8c8c8c',
  white: '#ffffff',
  black: '#000000',
  blue: '#0000ff',
  red: '#FC0100',
  redback: '#FFE5E5',
  blueback: '#CCFFCF'
}

//日期的格式化操作
export const _formatDate = (date) => {
  if ((date === '') || (date.toString() === 'Invalid Date')) return '';
  let d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  let year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('/');
}
export const getDateNowEX = () => {
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

//通用的样式
export const CommonStyles = StyleSheet.create(
  {
    container: {
      backgroundColor: COLORS.back,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "stretch",
      flex: 1,
      padding: 5
    },
    headerTitle: {
      color: COLORS.white,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 25,
      paddingBottom: 5,
    },
    headerButtonLeft: {
      borderColor: COLORS.white,
      borderWidth: 0,
      borderRadius: 0,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      marginTop: 0,
      marginLeft: 5,
      marginRight: 5,
      width: 120,
      height: 50,
    },
    headerButtonRight: {
      borderColor: COLORS.white,
      borderWidth: 0,
      borderRadius: 0,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-end",
      marginTop: 0,
      marginLeft: 5,
      marginRight: 5,
      width: 120,
      height: 50,
    },
    headerButtonText: {
      color: COLORS.white,
      fontSize: 18,
      fontWeight: 'bold',
      alignItems: "center",
      textAlign: "center",
    },


    emptyContainer: {
      paddingLeft: 5,
      paddingRight: 5,
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    emptyTitleContent: {
      color: "#bababa",
      fontSize: FONTSIZE.default,
      paddingLeft: 5,
      paddingRight: 5,
      marginTop: 50
    },
    searchContainer: {
      height: 45,
      paddingLeft: 0,
      paddingRight: 0,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "stretch",
      marginBottom: 10
    },
    text: {
      //fontWeight: 'bold',
      height: 50,
      borderColor: COLORS.border,
      borderWidth: 1,
      borderRadius: 0,
      backgroundColor: COLORS.border,
      paddingRight: 10,
      paddingLeft: 10,
      paddingTop: 5,
      paddingBottom: 5,
      fontSize: FONTSIZE.default,
      flex: 1,
      textAlignVertical: "center"
    },
    inputContainer: {
      height: 50,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 5
    },
    input: {
      //fontWeight: 'bold',
      height: 50,
      borderColor: COLORS.border,
      borderWidth: 1,
      borderRadius: 0,
      backgroundColor: COLORS.white,
      paddingRight: 10,
      paddingLeft: 10,
      paddingTop: 5,
      paddingBottom: 5,
      fontSize: FONTSIZE.default,
      flex: 1
    },

    labelContainer: {
      height: 20,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "flex-end"
    },
    label: {
      fontSize: FONTSIZE.default,
    },
    buttonContainer: {
      height: 50,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "stretch",
      marginTop: 20,
      marginBottom: 20,

    },
    button: {
      flex: 1,
      backgroundColor: COLORS.red,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 0,
      borderRadius: 0,
    },
    buttoncommon: {
      flex: 1,
      backgroundColor: COLORS.main,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 0,
      borderRadius: 0,
    },
    listScanButton: {
      backgroundColor: COLORS.main,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 0,
      borderRadius: 0,
    },
    buttonText: {
      color: COLORS.white,
      fontSize: FONTSIZE.default,
      //fontWeight: 'bold'
    },
    footerContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    footer: {
      height: 50,
      borderWidth: 0,
      flexDirection: 'row',
      justifyContent: "center",
      alignItems: "center",
    },
    footerTitle: {
      color: COLORS.black,
      fontSize: 10,
    },
    dateArea: {
      height: 50,
      borderColor: '#a6a6a6',
      borderWidth: 1,
      borderRadius: 0,
      backgroundColor: COLORS.border,
      paddingRight: 10,
      paddingLeft: 10,
      marginLeft: 0,
      marginRight: 0,
      flexDirection: 'row',
      justifyContent: "flex-start",
      alignItems: "center",

    },
    dateAreaText: {
      fontWeight: 'bold',
      fontSize: FONTSIZE.default,
      paddingLeft: 0
    },

    dateContainer: {
      height: 50,
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "stretch",
      marginBottom: 5
    },
    scanbuttonContainer: {
      height: 50,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-end",
      //paddingRight: 5,
      paddingLeft: 5
    },
    button: {
      width: 80,
      height: 50,
      backgroundColor: COLORS.main,
      borderWidth: 0,
      borderRadius: 0,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      color: COLORS.white,
      fontSize: FONTSIZE.small,
      //fontWeight: 'bold'
    },
    combocontainer: {
      backgroundColor: COLORS.white,
      borderColor: COLORS.border,
      borderWidth: 1,
      borderRadius: 0,
      height: 50,
      flex: 1
    },
    combo: {
      height: 30,
      marginTop: 10,
      fontSize: 13
    },
    flatList: {
      flex: 1,
      paddingLeft: 0,
      paddingRight: 0,
    },
    scannerContainer: {
      height: 300,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "stretch",
      borderRadius: 0,
    },
    scanView: {
      height: 290,
      borderRadius: 0,
    },
    imgContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 0,
      paddingRight: 5,
      paddingLeft: 5,
      marginBottom: 5,
    },
    img: {
      height: Dimensions.get('window').width - 10,
      width: Dimensions.get('window').width - 10,
      borderColor: COLORS.border,
      borderWidth: 1,
      borderRadius: 0,
    },
    doublebuttonContainer: {
      height: 50,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      paddingRight: 0,
      paddingLeft: 0,
      marginTop: 0,
    },
  }
)

