import { View, ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { Box, TextView, TextViewProps, VABulletList, VABulletListText, VAIcon, VAScrollView } from 'components'
import { testIdProps } from 'utils/accessibility'
import { useAccessibilityFocus, useOrientation, useTheme } from 'utils/hooks'
import { useFocusEffect } from '@react-navigation/native'

export type GenericOnboardingProps = {
  header: string
  headerA11yLabel?: string
  text?: string
  textA11yLabel?: string
  // optional list of text for using bullet points instead of plain text
  listOfText?: Array<string | VABulletListText>
  displayLogo?: boolean
  centerHeader?: boolean
}

const GenericOnboarding: FC<GenericOnboardingProps> = ({ header, text, displayLogo, headerA11yLabel, textA11yLabel, listOfText, centerHeader }) => {
  const theme = useTheme()
  const [focusRef, setFocus] = useAccessibilityFocus<View>()
  const isPortrait = useOrientation()

  useFocusEffect(setFocus)

  const headerProps: TextViewProps = {
    variant: 'MobileBodyBold',
    color: 'primaryContrast',
    accessibilityRole: 'header',
    mt: displayLogo ? theme.dimensions.standardMarginBetween : 0,
  }

  const containerStyle: ViewStyle = {
    flexGrow: 1,
    backgroundColor: theme.colors.background.splashScreen,
    justifyContent: 'center',
  }

  return (
    <VAScrollView contentContainerStyle={containerStyle} alwaysBounceVertical={false} removeInsets={true}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        {displayLogo && (
          <Box my={theme.dimensions.standardMarginBetween} alignItems={'center'}>
            <VAIcon name="Logo" testID="VAIconOnboardingLogo" />
          </Box>
        )}
        <Box alignItems={centerHeader ? 'center' : 'flex-start'}>
          <View ref={focusRef} accessible={true}>
            <TextView {...headerProps} {...testIdProps(headerA11yLabel || header)}>
              {header}
            </TextView>
          </View>
        </Box>
        {text && (
          <TextView {...testIdProps(textA11yLabel || text)} variant="MobileBody" color="primaryContrast" mt={theme.dimensions.standardMarginBetween}>
            {text}
          </TextView>
        )}
        {listOfText && (
          <Box mt={theme.dimensions.standardMarginBetween} ml={theme.dimensions.gutter}>
            <VABulletList listOfText={listOfText} />
          </Box>
        )}
      </Box>
    </VAScrollView>
  )
}

export default GenericOnboarding
