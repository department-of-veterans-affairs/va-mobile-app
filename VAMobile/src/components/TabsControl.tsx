import { ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { BackgroundVariant, BorderColorVariant, Box, TextView } from 'components'
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

type TabsControlProps = {
  /** method to trigger on tab change */
  onChange: (value: number) => void
  /** tab information */
  tabs: TabsValuesType
  /** boolean to set the selected tab */
  selected: number
}

const TabsControl: FC<TabsControlProps> = ({ onChange, tabs, selected }) => {
  const theme = useTheme()

  const mainContainerStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between',
  }

  const tabButtonStyle: ViewStyle = {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  }

  const getTabBackgroundColor = (isSelected: boolean): BackgroundVariant => {
    return (isSelected ? theme.colors.background.tabSelectorActive : theme.colors.background.tabSelectorInactive) as BackgroundVariant
  }
  const getBorderColor = (isSelected: boolean): BorderColorVariant => {
    return (isSelected ? theme.colors.border.tabSelectorActive : theme.colors.border.tabSelectorInactive) as BorderColorVariant
  }

  return (
    <Box style={mainContainerStyle}>
      {tabs.map((tab, index) => {
        const { a11yHint, title, a11yLabel } = tab
        const isSelected = selected === index

        return (
          <Box
            key={index}
            width={`${100 / tabs.length}%`}
            backgroundColor={getTabBackgroundColor(isSelected)}
            borderBottomColor={getBorderColor(isSelected)}
            borderBottomWidth={isSelected ? 2 : 1}
            accessibilityLabel={a11yLabel}
            accessibilityHint={a11yHint}
            accessibilityRole={'tab'}
            accessible={true}
            accessibilityState={{ selected: isSelected }}
            accessibilityValue={{ text: `tab position ${index + 1} of ${tabs.length}` }}>
            <TouchableWithoutFeedback onPress={() => onChange(index)} style={tabButtonStyle}>
              <TextView variant={isSelected ? 'MobileBodyBold' : 'MobileBody'} textAlign="center">
                {title}
              </TextView>
            </TouchableWithoutFeedback>
          </Box>
        )
      })}
    </Box>
  )
}

export default TabsControl
