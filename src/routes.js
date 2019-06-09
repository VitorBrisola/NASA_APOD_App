import { createStackNavigator, createAppContainer } from 'react-navigation';

import Main from './pages/main';
import color from './config/color';
import APOD from './pages/apod';

const Routes = createStackNavigator({
  Main,
  APOD
}, {
  defaultNavigationOptions: () => ({
    headerStyle:{
      backgroundColor:  color.statusBar,
    },
    headerTintColor: "#FFF"
  }),
}); 

export default createAppContainer(Routes);