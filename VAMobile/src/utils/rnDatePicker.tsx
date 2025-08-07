import { NativeModules } from 'react-native'

import { isIOS } from 'utils/platform'

// DatePicker bridge from iOS and Android
const RNDatePicker = NativeModules.RNDatePicker

export async function datePicker(): Promise<string | null> {
  console.log('inside datepicker')
  if (isIOS()) {
    return null
  } else {
    try {
      console.log('calling waait')
      const dateStr: string = await RNDatePicker.showDatePicker()
      console.log('returning from await')
      return dateStr
    } catch (e) {
      console.error('Date picker error', e)
      return null
    }
  }
}
