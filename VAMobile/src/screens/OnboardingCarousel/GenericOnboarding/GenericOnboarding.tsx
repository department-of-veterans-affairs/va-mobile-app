import { StyleSheet, View, ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { Box, BoxProps, TextView, TextViewProps, VABulletList, VABulletListText, VAIcon, VAIconProps, VAScrollView, VA_ICON_MAP } from 'components'
import { testIdProps } from 'utils/accessibility'
import { useAccessibilityFocus, useTheme } from 'utils/hooks'
import { useFocusEffect } from '@react-navigation/native'

export type GenericOnboardingProps = {
  header: string
  headerA11yLabel?: string
  text?: string
  textA11yLabel?: string
  // optional list of text for using bullet points instead of plain text
  listOfText?: Array<string | VABulletListText>
  testID: string
  iconToDisplay: keyof typeof VA_ICON_MAP
}

const headerContainerStyle = StyleSheet.create({
  headerContainer: {
    flex: 1,
  },
})

const GenericOnboarding: FC<GenericOnboardingProps> = ({ header, text, testID, iconToDisplay, headerA11yLabel, textA11yLabel, listOfText }) => {
  const theme = useTheme()
  const [focusRef, setFocus] = useAccessibilityFocus()
  useFocusEffect(setFocus)

  const headerProps: TextViewProps = {
    variant: 'MobileBodyBold',
    color: 'primaryContrast',
    accessibilityRole: 'header',
    mt: theme.dimensions.standardMarginBetween,
  }

  const containerStyle: ViewStyle = {
    flexGrow: 1,
    backgroundColor: theme.colors.background.splashScreen,
    justifyContent: 'center',
  }

  const vaIconProps = (): VAIconProps => {
    let iconProps: VAIconProps = { name: iconToDisplay }

    if (iconToDisplay !== 'Logo') {
      iconProps = { ...iconProps, height: 70, width: 70, stroke: theme.colors.icon.contrast, fill: theme.colors.icon.contrast }
    }

    return iconProps
  }

  const iconContainerProps: BoxProps = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  }

  return (
    <VAScrollView {...testIdProps(testID)} contentContainerStyle={containerStyle} alwaysBounceVertical={false} accessible={false} importantForAccessibility={'no'}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <Box my={theme.dimensions.standardMarginBetween} {...iconContainerProps}>
          <VAIcon {...vaIconProps()} />
        </Box>
        <View accessible={true} importantForAccessibility={'yes'} ref={focusRef} style={headerContainerStyle.headerContainer}>
          <TextView {...headerProps} {...testIdProps(headerA11yLabel || header)} selectable={false}>
            {header}
          </TextView>
        </View>
        {text && (
          <Box accessible={true}>
            <TextView {...testIdProps(textA11yLabel || text)} variant="MobileBody" color="primaryContrast" mt={theme.dimensions.standardMarginBetween} selectable={false}>
              {text}
            </TextView>
          </Box>
        )}
        {listOfText && (
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VABulletList listOfText={listOfText} bulletColor="contrast" />
          </Box>
        )}
      </Box>
    </VAScrollView>
  )
}

export default GenericOnboarding
