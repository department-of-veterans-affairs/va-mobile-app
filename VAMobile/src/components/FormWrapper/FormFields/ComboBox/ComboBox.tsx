import React, { FC, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, Pressable, PressableProps, TextInput, TextInputProps, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'
import _ from 'underscore'

import { Box, BoxProps, ComboBoxItem, ComboBoxOptions, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

import { getInputWrapperProps } from '../formFieldUtils'

export type ComboBoxProps = {
  selectedValue?: ComboBoxItem
  onSelectionChange: (item?: ComboBoxItem) => void
  comboBoxOptions: ComboBoxOptions
  onClose: () => void
}

const ComboBox: FC<ComboBoxProps> = ({ selectedValue, onSelectionChange, comboBoxOptions, onClose }) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const [filterStr, setFilterStr] = useState('')
  const [filteredOptions, setFilteredOptions] = useState<ComboBoxOptions>(comboBoxOptions)

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)

  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardWillShow', () => {
      setIsKeyboardVisible(true)
    })
    const hideListener = Keyboard.addListener('keyboardWillHide', () => {
      setIsKeyboardVisible(false)
    })
    return () => {
      showListener.remove()
      hideListener.remove()
    }
  }, [])

  const containerStyle: BoxProps = {
    backgroundColor: 'menu',
    flex: 1,
  }

  const scrollContainerStyle: ViewStyle = {
    flexGrow: 1,
    backgroundColor: theme.colors.background.menu,
    paddingBottom: isKeyboardVisible ? Keyboard.metrics()?.height : insets.bottom,
  }

  const headerStyle: BoxProps = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    p: 16,
  }

  const closeIconStyle = {
    fill: 'base',
    width: 30,
    height: 30,
  }

  const closeIconProps: PressableProps = {
    onPress: onClose,
    accessibilityRole: 'button',
    accessibilityHint: t('close'),
  }

  const listGroupHeaderStyle: BoxProps = {
    // this color var doesn't really make sense
    // if we add a new one, what is the dark mode equivalent - does it matter?
    backgroundColor: 'navButton',
    p: 12,
    borderColor: 'primary',
  }

  const listItemStyle: BoxProps = {
    pl: 32,
    py: 8,
    borderColor: 'primary',
    borderTopWidth: 1,
  }

  const inputContainerStyle: BoxProps = {
    px: 12,
    pb: 16,
    borderColor: 'primary',
    borderBottomWidth: 1,
  }

  const wrapperProps = getInputWrapperProps(theme, undefined, isInputFocused)

  const inputProps: TextInputProps = {
    onChangeText: (newVal) => setFilterStr(newVal),
    onFocus: () => setIsInputFocused(true),
    onBlur: () => setIsInputFocused(false),
    value: filterStr,
    autoFocus: true,
    style: {
      fontSize: theme.fontSizes.MobileBody.fontSize,
      fontFamily: theme.fontFace.regular,
    },
  }

  useEffect(() => {
    setFilterStr(selectedValue?.label || '')
  }, [selectedValue])

  useEffect(() => {
    const updatedFilteredOpts: ComboBoxOptions = {}
    _.each(comboBoxOptions, (options, groupName) => {
      updatedFilteredOpts[groupName] = _.filter(options, (opt: ComboBoxItem) =>
        String(opt.label).toLowerCase().includes(filterStr.toLowerCase()),
      )
    })
    setFilteredOptions(updatedFilteredOpts)
  }, [comboBoxOptions, filterStr])

  // Apply bold and underline to searched item
  const renderFilterableItem = (label: string) => {
    const lowerCaseLabel = label.toLowerCase()
    const lowerCaseFilterStr = filterStr.toLowerCase()

    const matchedIndex = lowerCaseLabel.indexOf(lowerCaseFilterStr)
    const before = label.slice(0, matchedIndex)
    const match = label.slice(matchedIndex, matchedIndex + filterStr.length)
    const after = label.slice(matchedIndex + filterStr.length)

    return (
      <TextView variant={'MobileBody'}>
        {before}
        <TextView variant={'MobileBodyBold'} textDecoration={'underline'}>
          {match}
        </TextView>
        {after}
      </TextView>
    )
  }

  const renderItems = () => {
    return _.map(filteredOptions, (items, groupName) => {
      if (!items.length) {
        return <></>
      }
      return (
        <Box borderBottomWidth={1} borderColor={'primary'} key={groupName}>
            <Box {...listGroupHeaderStyle}>
              <TextView variant={'MobileBodyBold'}>{groupName + 'test'}</TextView>
            </Box>
          {_.map(items, ({ value, label }) => {
            const handleSelection = () => {
              onSelectionChange({ value, label })
              onClose()
            }
            return (
              <Pressable accessibilityRole="button" onPress={handleSelection} key={value}>
                <Box {...listItemStyle}>{renderFilterableItem(label)}</Box>
              </Pressable>
            )
          })}
        </Box>
      )
    })
  }

  return (
    <Box {...containerStyle}>
      <Box {...headerStyle}>
        <TextView variant={'MobileBodyBold'}>{t('secureMessaging.formMessage.careTeam')}</TextView>
        <Pressable {...closeIconProps}>
          <Icon name={'Close'} {...closeIconStyle} />
        </Pressable>
      </Box>
      <Box {...inputContainerStyle}>
        <Box {...wrapperProps}>
          <Box width="100%">
            <TextInput {...inputProps} ref={inputRef} />
          </Box>
        </Box>
      </Box>
      <VAScrollView contentContainerStyle={scrollContainerStyle}>{renderItems()}</VAScrollView>
    </Box>
  )
}

export default ComboBox
