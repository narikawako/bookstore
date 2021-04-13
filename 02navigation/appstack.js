import { createStackNavigator } from 'react-navigation-stack';
import Home from '../01screen/home';
import ModifyPWD from '../01screen/pwdmodify';
// import BookList from '../01screen/booklist';
// import BookItem from '../01screen/bookitem';
// import BookCateList from '../01screen/bookcatelist';

export default AppStack = createStackNavigator(
  {
    home: Home,
    modifypwd: ModifyPWD,
    // booklist:BookList,
    // bookitem:BookItem,
    // bookcatelist:BookCateList,
  },
  {
    initialRouteName: 'home',
  }
);