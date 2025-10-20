/**
 * @format
 */
import { AppRegistry } from 'react-native'

import { Buffer } from 'buffer'

import { name as appName } from './app.json'
import App from './src/App'

global.Buffer = global.Buffer || Buffer

AppRegistry.registerComponent(appName, () => App)
