import 'styled-components/native'

import { VATheme } from './src/styles/theme'

declare module 'styled-components/native' {
  export interface DefaultTheme extends VATheme {}
}
