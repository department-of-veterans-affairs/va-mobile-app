import { ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { BorderColorVariant, Box, TextView } from 'components'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useTheme } from 'utils/hooks'

export type TabsValuesType = Array<{
  /** value of the tab */
  value: string
  /** title of the tab that will be displayed */
  title: string
  /** accessibility label of the tab */
  a11yLabel?: string
  /** accessibility hint of the tab */
  a11yHint?: string
}>

type TabBarProps = {
  /** method to trigger on tab change */
  onChange: (value: string) => void
  /** tab information */
  tabs: TabsValuesType
  /** string to set the selected tab */
  selected: string
}

const TabBar: FC<TabBarProps> = ({ onChange, tabs, selected }) => {
  const theme = useTheme()

  const mainContainerStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  }

  const tabButtonStyle: ViewStyle = {
    paddingHorizontal: 10,
    height: 54,
    justifyContent: 'center',
  }

  const getBorderColor = (isSelected: boolean): BorderColorVariant => {
    return (isSelected ? theme.colors.border.tabSelectorActive : theme.colors.border.tabSelectorInactive) as BorderColorVariant
  }

  return (
    <Box style={mainContainerStyle}>
      {tabs.map((tab, index) => {
        const { a11yHint, title, a11yLabel, value } = tab
        const isSelected = selected === value

        return (
          <Box
            key={index}
            flexGrow={1}
            flexShrink={0}
            borderBottomColor={getBorderColor(isSelected)}
            borderBottomWidth={2.5}
            accessibilityLabel={a11yLabel}
            accessibilityHint={a11yHint}
            accessibilityRole={'tab'}
            accessible={true}
            accessibilityState={{ selected: isSelected }}
            accessibilityValue={{ text: `tab position ${index + 1} of ${tabs.length}` }}>
            <TouchableWithoutFeedback onPress={() => onChange(value)} style={tabButtonStyle}>
              <TextView
                maxFontSizeMultiplier={1.5}
                variant={isSelected ? 'MobileBodyBold' : 'MobileBody'}
                color={isSelected ? 'tabSelectorActive' : 'tabSelectorInactive'}
                textAlign="center">
                {title}
              </TextView>
            </TouchableWithoutFeedback>
          </Box>
        )
      })}
    </Box>
  )
}

export default TabBar
