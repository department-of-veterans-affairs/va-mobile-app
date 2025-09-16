import Reactotron from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'

import getEnv from './src/utils/env'

const { REACTOTRON_ENABLED } = getEnv()

let reactotron = Reactotron.configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .use(reactotronRedux()) // allows app state to be viewed

if (__DEV__ && REACTOTRON_ENABLED) {
  reactotron.connect() // let's connect!
}

export default reactotron
