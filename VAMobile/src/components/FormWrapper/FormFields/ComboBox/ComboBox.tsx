import React, { FC, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, Pressable, PressableProps, TextInput, TextInputProps, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, BoxProps, ComboBoxItem, ComboBoxOptions, TextView, VAScrollView } from 'components'
import { getInputWrapperProps } from 'components/FormWrapper/FormFields/formFieldUtils'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

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

  // Adds bottom padding to scroll container when keyboard is visible
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
    p: theme.dimensions.lineItemSpacing,
  }

  const closeIconProps: PressableProps = {
    onPress: onClose,
    accessibilityRole: 'button',
    accessibilityHint: t('close'),
  }

  const listGroupHeaderStyle: BoxProps = {
    backgroundColor: 'navButton',
    p: theme.dimensions.headerButtonSpacing,
    borderColor: 'primary',
  }

  const listItemStyle: BoxProps = {
    pl: theme.dimensions.listItemComboBoxMarginLeft,
    py: theme.dimensions.smallMarginBetween,
    borderColor: 'primary',
    borderTopWidth: theme.dimensions.borderWidth,
  }

  const inputContainerStyle: BoxProps = {
    px: theme.dimensions.inputPadding,
    pb: theme.dimensions.lineItemSpacing,
    borderColor: 'primary',
    borderBottomWidth: theme.dimensions.borderWidth,
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

    Object.entries(comboBoxOptions).forEach((keys) => {
      const groupName = keys[0]
      const options = keys[1]
      updatedFilteredOpts[groupName] = (options as ComboBoxItem[]).filter((opt) =>
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
    return Object.entries(filteredOptions).map((keys) => {
      const groupName = keys[0]
      const items = keys[1] as ComboBoxItem[]
      if (!items.length) {
        return <></>
      }
      return (
        <Box borderBottomWidth={1} borderColor={'primary'} key={groupName}>
          <Box {...listGroupHeaderStyle}>
            <TextView variant={'MobileBodyBold'}>{groupName}</TextView>
          </Box>
          {items.map(({ value, label }) => {
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
          <Icon name={'Close'} width={30} height={30} fill={'base'} />
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
