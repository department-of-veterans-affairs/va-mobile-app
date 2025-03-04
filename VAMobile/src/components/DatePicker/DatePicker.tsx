import React, { FC, useState } from 'react'
import {
  AccessibilityProps,
  Modal,
  Pressable,
  PressableStateCallbackType,
  TextInput,
  View,
  ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import Display from '@react-native-community/datetimepicker'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'

import { getFormattedDate } from '../../utils/formattingUtils'
import { useTheme } from '../../utils/hooks'
import { isAndroid } from '../../utils/platform'
import Box from '../Box'
import { TextView } from '../index'

export type DatePickerProps = {
  displayMode?: 'spinner' | 'default' | 'clock' | 'calendar'
  componentStyle?: ViewStyle
  design?: 'default' | 'material'
}

export const DatePicker: FC<DatePickerProps> = ({ displayMode, componentStyle, design = 'default' }) => {
  const theme = useTheme()
  const [date, setDate] = useState(new Date(Date.now()))
  const [IOSSpinnerDate, setIOSSpinnerDate] = useState(new Date(Date.now()))
  const [show, setShow] = useState(false)
  const insets = useSafeAreaInsets()

  // Testing if this even gets called
  const a11yProps: AccessibilityProps = {
    accessibilityLabel: 'Open Calendar',
    'aria-label': 'Open Calendar',
    'aria-modal': true,
  }
  //@ts-ignore
  const onChange = (event, selectedDate) => {
    setDate(selectedDate)

    if (!isAndroid()) {
      setShow(false)
    }
  }
  //@ts-ignore
  const onChangeIOSSpinner = (event, selectedDate) => {
    setIOSSpinnerDate(selectedDate)
  }

  const onAndroidDatePick = () => {
    if (isAndroid()) {
      DateTimePickerAndroid.open({
        value: date,
        onChange,
        mode: 'date',
        display: displayMode || 'default',
        is24Hour: true,
        ...a11yProps,
      })
    } else {
      setShow(true)
    }
  }

  const pressableStyle = ({ pressed }: PressableStateCallbackType): ViewStyle => ({
    borderRadius: 8,
    paddingLeft: theme.dimensions.buttonPadding,
    paddingRight: theme.dimensions.tinyMarginBetween,
    paddingVertical: theme.dimensions.buttonPadding,
    backgroundColor: pressed ? theme.colors.background.listActive : theme.colors.background.linkRow,
    marginBottom: theme.dimensions.condensedMarginBetween,
    flexDirection: 'row',
    alignItems: 'center',
  })

  const renderIOSSpinner = () => {
    return (
      <>
        <Pressable style={pressableStyle} onPress={onAndroidDatePick} accessible={true} accessibilityRole={'button'}>
          <TextView
            variant={'HomeScreen'}
            accessibilityLabel={`Date Picker ${getFormattedDate(date.toISOString(), 'MMM d, yyyy')}`}>
            {getFormattedDate(date.toISOString(), 'MMM d, yyyy')}
          </TextView>
        </Pressable>
        <View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={show}
            supportedOrientations={['portrait', 'landscape']}
            onRequestClose={() => {
              setShow(!show)
            }}>
            <Box
              flex={1}
              width={'100%'}
              flexDirection="column"
              accessibilityViewIsModal={true}
              justifyContent={'center'}>
              <Box width={'100%'} height={'100%'} backgroundColor="modalOverlay" opacity={0.8} position={'absolute'} />
              <Box
                backgroundColor={'alertBox'}
                borderRadius={3}
                p={20}
                ml={insets.left}
                mr={insets.right}
                mx={theme.dimensions.gutter}>
                <Box borderBottomColor={'secondary'} borderBottomWidth={2} my={theme.dimensions.standardMarginBetween}>
                  <DateTimePicker
                    {...a11yProps}
                    design={design}
                    style={componentStyle}
                    testID="dateTimePicker"
                    value={IOSSpinnerDate}
                    mode={'date'}
                    display={displayMode || 'default'}
                    onChange={onChangeIOSSpinner}
                  />
                </Box>
                <Box flexDirection={'row'} justifyContent={'flex-end'}>
                  <Box mr={theme.dimensions.standardMarginBetween}>
                    <Pressable
                      onPress={() => {
                        setShow(false)
                      }}>
                      <TextView allowFontScaling={false} variant="MobileBody" textTransform="uppercase" color="link">
                        {'Cancel'}
                      </TextView>
                    </Pressable>
                  </Box>
                  <Pressable
                    onPress={() => {
                      setDate(IOSSpinnerDate)
                      setShow(false)
                    }}>
                    <TextView allowFontScaling={false} variant="MobileBody" textTransform="uppercase" color="link">
                      {'Confirm'}
                    </TextView>
                  </Pressable>
                </Box>
              </Box>
            </Box>
          </Modal>
        </View>
      </>
    )
  }

  const render = () => {
    if (isAndroid()) {
      return (
        <Pressable style={pressableStyle} onPress={onAndroidDatePick} accessible={true} accessibilityRole={'button'}>
          <TextView
            variant={'HomeScreen'}
            accessibilityLabel={`Date Picker ${getFormattedDate(date.toISOString(), 'MMM d, yyyy')}`}>
            {getFormattedDate(date.toISOString(), 'MMM d, yyyy')}
          </TextView>
        </Pressable>
      )
    }

    // IOS spinner
    if (!isAndroid() && displayMode === 'spinner') {
      return renderIOSSpinner()
    }

    return (
      <DateTimePicker
        {...a11yProps}
        design={design}
        style={componentStyle}
        testID="dateTimePicker"
        value={date}
        mode={'date'}
        display={displayMode || 'default'}
        onChange={onChange}
      />
    )
  }

  return <Box mx={theme.dimensions.condensedMarginBetween}>{render()}</Box>
}

export default DatePicker
