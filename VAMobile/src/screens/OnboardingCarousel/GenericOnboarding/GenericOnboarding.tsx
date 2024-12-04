import React from 'react'
import { View, ViewStyle } from 'react-native'

import { useFocusEffect } from '@react-navigation/native'

import { Box, TextView, TextViewProps, VABulletList, VABulletListText, VALogo, VAScrollView } from 'components'
import { useAccessibilityFocus, useOrientation, useTheme } from 'utils/hooks'

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

function GenericOnboarding({
  header,
  text,
  displayLogo,
  textA11yLabel,
  listOfText,
  centerHeader,
}: GenericOnboardingProps) {
  const theme = useTheme()
  const [focusRef, setFocus] = useAccessibilityFocus<View>()
  const isPortrait = useOrientation()

  useFocusEffect(setFocus)

  const headerProps: TextViewProps = {
    variant: 'MobileBodyBold',
    color: 'primaryContrast',
    mt: displayLogo ? theme.dimensions.standardMarginBetween : 0,
  }

  const containerStyle: ViewStyle = {
    flexGrow: 1,
    backgroundColor: theme.colors.background.splashScreen,
    justifyContent: 'center',
  }

  return (
    <VAScrollView contentContainerStyle={containerStyle} alwaysBounceVertical={false} removeInsets={true}>
      <Box
        mt={theme.dimensions.contentMarginTop}
        mb={theme.dimensions.contentMarginBottom}
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        {displayLogo && (
          <Box my={theme.dimensions.standardMarginBetween} alignItems={'center'}>
            <VALogo variant="dark" testID="VAIconOnboardingLogo" />
          </Box>
        )}
        <Box alignItems={centerHeader ? 'center' : 'flex-start'}>
          <View ref={focusRef} accessible={true} accessibilityRole={'header'}>
            <TextView {...headerProps}>{header}</TextView>
          </View>
        </Box>
        {text && (
          <TextView
            accessibilityLabel={textA11yLabel}
            variant="MobileBody"
            color="primaryContrast"
            mt={theme.dimensions.standardMarginBetween}>
            {text}
          </TextView>
        )}
        {listOfText && (
          <Box mt={theme.dimensions.standardMarginBetween} ml={theme.dimensions.gutter}>
            <VABulletList listOfText={listOfText} paragraphSpacing={true} bulletColor={'carouselBullet'} />
          </Box>
        )}
      </Box>
    </VAScrollView>
  )
}

export default GenericOnboarding
