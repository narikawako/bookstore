import { createStackNavigator } from 'react-navigation-stack';
import  Login  from '../01screen/login';

export default LoginStack = createStackNavigator(
  {
    login: Login
  }
);