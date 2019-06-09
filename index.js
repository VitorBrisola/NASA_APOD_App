/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/index'; // automaticaly searches for index.js
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
