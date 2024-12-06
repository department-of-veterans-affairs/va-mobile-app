declare module '@env' {}

declare var mockStore: any

declare module '*.svg' {
  import { SvgProps } from 'react-native-svg'
  const content: React.FC<
    SvgProps & {
      fillSecondary?: string
    }
  >
  export default content
}

// react-native-keyboard-manager.d.ts
declare module 'react-native-keyboard-manager' {
  export function setEnable(arg: boolean): void
  export function setKeyboardDistanceFromTextField(arg: number): void
  export function setEnableAutoToolbar(arg: boolean): void
}

declare var global: any

declare var process: any
