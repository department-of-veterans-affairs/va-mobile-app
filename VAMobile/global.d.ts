declare namespace WebdriverIO {
  // adding command to `$()`
  interface Element {
    // don't forget to wrap return values with Promise
    elementCustomCommand: (arg: any) => Promise<number>
  }
}

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

// this makes it posible to call the snackbar from outside react components and also types the data object
type ToastOptions = import('react-native-toast-notifications/lib/typescript/toast').ToastOptions
type ToastType = import('react-native-toast-notifications').ToastType

type modifyToastOptions = Omit<ToastOptions, 'data'> & {
  data?: {
    onActionPressed?: () => void
    isError?: boolean
    actionBtnText?: string
    isUndo?: boolean
  }
}

type modifyToastType = Omit<ToastType, 'show'> & {
  show: (message: string | JSX.Element, toastOptions?: modifyToastOptions | undefined) => string
}

declare var snackBar: modifyToastType
