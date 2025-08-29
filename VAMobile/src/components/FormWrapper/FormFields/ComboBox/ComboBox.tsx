import React, { FC, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, Pressable, PressableProps, SectionList, TextInput, TextInputProps, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, BoxProps, ComboBoxItem, ComboBoxOptions, TextView, VAScrollView } from 'components'
import { getInputWrapperProps } from 'components/FormWrapper/FormFields/formFieldUtils'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

export type ComboBoxProps = {
  titleKey: string
  selectedValue?: ComboBoxItem
  onSelectionChange: (item?: ComboBoxItem) => void
  comboBoxOptions: ComboBoxOptions
  onClose: () => void
  virtualized?: boolean
  hideGroupsHeaders?: boolean
}

const ComboBox: FC<ComboBoxProps> = ({
  onSelectionChange,
  comboBoxOptions,
  onClose,
  titleKey,
  hideGroupsHeaders = false,
  virtualized = false,
}) => {
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
    accessibilityLabel: t('close'),
    ...a11yHintProp(t('secureMessaging.startNewMessage.combobox.close')),
  }

  const listGroupHeaderStyle: BoxProps = {
    backgroundColor: 'navButton',
    p: theme.dimensions.headerButtonSpacing,
    borderColor: 'primary',
  }

  const listItemStyle: BoxProps = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.dimensions.smallMarginBetween,
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
    style: {
      fontSize: theme.fontSizes.MobileBody.fontSize,
      fontFamily: theme.fontFace.regular,
    },
  }

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
    if (virtualized) {
      const sections = Object.entries(filteredOptions).map((keys) => {
        return {
          title: keys[0],
          data: keys[1] as Array<ComboBoxItem>,
        }
      })

      const renderItem = ({ item }: { item: ComboBoxItem }) => {
        const handleSelection = () => {
          onSelectionChange(item)
          onClose()
        }

        return (
          <Pressable accessibilityRole="button" onPress={handleSelection}>
            <Box {...listItemStyle}>
              {item.icon}
              {renderFilterableItem(item.label)}
            </Box>
          </Pressable>
        )
      }

      const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => {
        return (
          <Box {...listGroupHeaderStyle}>
            <TextView variant={'MobileBodyBold'}>{title}</TextView>
          </Box>
        )
      }

      return (
        <SectionList
          sections={sections}
          renderItem={renderItem}
          renderSectionHeader={hideGroupsHeaders ? undefined : renderSectionHeader}
          keyExtractor={(item, index) => `${item.value}-${index}`}
        />
      )
    }

    return Object.entries(filteredOptions).map((keys) => {
      const groupName = keys[0]
      const items = keys[1] as ComboBoxItem[]
      if (!items.length) {
        return <></>
      }

      let header
      if (!hideGroupsHeaders) {
        header = (
          <Box {...listGroupHeaderStyle}>
            <TextView variant={'MobileBodyBold'}>{groupName}</TextView>
          </Box>
        )
      }

      return (
        <Box borderBottomWidth={1} borderColor={'primary'} key={groupName}>
          {header}
          {items.map(({ value, label, icon }) => {
            const handleSelection = () => {
              onSelectionChange({ value, label })
              onClose()
            }
            return (
              <Pressable accessibilityRole="button" onPress={handleSelection} key={value}>
                <Box {...listItemStyle}>
                  {icon}
                  {renderFilterableItem(label)}
                </Box>
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
        <TextView variant={'MobileBodyBold'}>{t(titleKey)}</TextView>
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
