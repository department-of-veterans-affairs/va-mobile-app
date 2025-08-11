import { requireNativeComponent } from 'react-native'
import { NativeSyntheticEvent, ViewProps } from 'react-native'

export type DateChangeEvent = NativeSyntheticEvent<{ date: string }>

interface Props extends ViewProps {
  date?: string
  minimumDate?: string
  maximumDate?: string
  onDateChange?: (event: DateChangeEvent) => void
}

const RNDatePicker = requireNativeComponent<Props>('RNDatePicker')

export default RNDatePicker
