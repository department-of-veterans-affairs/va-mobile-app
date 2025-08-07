import { requireNativeComponent } from 'react-native'
import { NativeSyntheticEvent, ViewProps } from 'react-native'

type DateChangeEvent = NativeSyntheticEvent<{ date: string }>

interface Props extends ViewProps {
  onDateChange?: (event: DateChangeEvent) => void
}

const RNDatePicker = requireNativeComponent<Props>('RNDatePicker')

export default RNDatePicker
