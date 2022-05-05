import React, { FC, useState } from 'react'

import { Box, SelectorType, TextView, VAScrollView } from 'components'

import { Alert, Button } from 'react-native'
import { isAndroid, isIOS } from '../../utils/platform'
import DateTimePicker, { AndroidNativeProps, DateTimePickerEvent } from '@react-native-community/datetimepicker'
import RadioGroup from '../../components/FormWrapper/FormFields/RadioGroup'
import VASelector from '../../components/FormWrapper/FormFields/VASelector'

/**
 *
 * Returns CalendarDateTimePicker component
 */
const CalendarDateTimePicker: FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [confirmDate, setConfirmDate] = useState<Date | undefined>(new Date())
  const [mode, setMode] = useState<AndroidNativeProps['mode'] | undefined>('date')
  const [show, setShow] = useState(false)
  const [displayType, setDisplayType] = useState<AndroidNativeProps['display'] | undefined>('default')
  const [limitDate, setLimitDate] = useState([false, false])
  const isIPHONE = isIOS()
  const isDroid = isAndroid()

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (isDroid) {
      setShow(false)
    }
    setDate(selectedDate)
  }

  const onConfirm = () => {
    setShow(false)
    setConfirmDate(date)
  }

  const showMode = (currentMode: AndroidNativeProps['mode']) => {
    setShow(true)
    setMode(currentMode)
  }

  const showDatepicker = () => {
    if (isDroid && displayType === 'clock') {
      Alert.alert('Invalid: clock only works for time mode')
      return
    }
    showMode('date')
  }

  const showTimepicker = () => {
    if (isDroid && displayType === 'calendar') {
      Alert.alert('Invalid: calendar only works for date mode')
      return
    }
    showMode('time')
  }

  const onSetDisplayType = (val: string) => {
    setDisplayType(val as AndroidNativeProps['display'])
    setConfirmDate(undefined)
  }

  const radioGroupPropsAndroid = {
    options: [
      {
        labelKey: 'default1',
        value: 'default',
      },
      {
        labelKey: 'spinner',
        value: 'spinner',
      },
      {
        labelKey: 'calendar(date mode only)',
        value: 'calendar',
      },
      {
        labelKey: 'clock(time mode only)',
        value: 'clock',
      },
    ],
    value: displayType,
    onChange: onSetDisplayType,
  }

  const radioGroupPropsIOS = {
    options: [
      {
        labelKey: 'default1',
        value: 'default',
      },
      {
        labelKey: 'spinner',
        value: 'spinner',
      },
      {
        labelKey: 'compact(ios 14 or later, spinner otherwise)',
        value: 'compact',
      },
      {
        labelKey: 'inline(ios 14 or later, spinner otherwise)',
        value: 'inline',
      },
    ],
    value: displayType,
    onChange: onSetDisplayType,
  }

  const radioGroupProps = isIPHONE ? radioGroupPropsIOS : radioGroupPropsAndroid

  const minDateProps = {
    selectorType: SelectorType.Checkbox,
    selected: limitDate[0],
    onSelectionChange: () => {
      const updated = [...limitDate]
      updated[0] = !updated[0]
      setLimitDate(updated)
    },
    labelKey: 'Min Date(5 days after the current day)',
  }

  const maxDateProps = {
    selectorType: SelectorType.Checkbox,
    selected: limitDate[1],
    onSelectionChange: () => {
      const updated = [...limitDate]
      updated[1] = !updated[1]
      setLimitDate(updated)
    },
    labelKey: 'Max Date(120 days after the current date)',
  }

  const now = new Date()
  const minDate = new Date()
  minDate.setDate(now.getDate() + 5)
  const maxDate = new Date()
  maxDate.setDate(now.getDate() + 120)

  const DateTimeProps = {
    testID: 'dateTimePicker',
    value: date || new Date(),
    mode,
    onChange,
    minuteInterval: 30,
    display: displayType,
    minimumDate: limitDate[0] ? minDate : undefined,
    maximumDate: limitDate[1] ? maxDate : undefined,
  }

  return (
    <VAScrollView>
      <Box>
        <Box>
          <Button onPress={showDatepicker} title="Request a Date" />
        </Box>
        <Box>
          <Button onPress={showTimepicker} title="Request a Time" />
        </Box>
        <RadioGroup {...radioGroupProps} />
        <VASelector {...minDateProps} />
        <VASelector {...maxDateProps} />
        <TextView>Selected: {date?.toLocaleString()}</TextView>
        <TextView>Confirmed: {confirmDate?.toLocaleString()}</TextView>
        {show && isIPHONE && <Button onPress={onConfirm} title="Confirm" />}
        {show && <DateTimePicker {...DateTimeProps} />}
      </Box>
    </VAScrollView>
  )
}

export default CalendarDateTimePicker
