import { LayoutChangeEvent, StatusBar, View, ViewStyle, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import React, { FC, ReactNode, useState } from 'react'

import { TextView, TextViewProps, VAIconProps } from 'components'
import { useIsScreenReaderEnabled, useTheme } from 'utils/hooks'
import HeaderBanner, { HeaderBannerProps } from './HeaderBanner'
import VAScrollView, { VAScrollViewProps } from 'components/VAScrollView'

/* To use these templates:
1. Wrap the screen content you want in <FeatureLandingTemplate> </FeatureLandingTemplate> or <ChildTemplate> </ChildTemplate> and
  supply the appropriate props for desired functionality
2. In the screen navigator update 'screenOptions={{ headerShown: false }}' to hide the previous navigation display for all screens in the navigator.
  Use 'options={{headerShown: false}}'(preferred method for subtask) in the individual screen if only an individual screen is supposed to do it.
*/

type headerButton = {
  label: string
  labelA11y?: string
  icon: VAIconProps
  onPress: () => void
  testID?: string
}

export type ChildTemplateProps = {
  /** Translated label text for descriptive back button */
  backLabel: string
  /** Optional a11y label for back button  */
  backLabelA11y?: string
  /** On press navigation for descriptive back button */
  backLabelOnPress: () => void
  /** Optional TestID for back */
  backLabelTestID?: string
  /** Title for page that transitions to header */
  title: string
  /** Optional a11y label for title  */
  titleA11y?: string
  /** Optional header button requiring label, icon, and onPress props */
  headerButton?: headerButton
  /** Optional footer content pinned below the scrollable space */
  footerContent?: ReactNode
  /** Optional ScrollView props to pass through to VAScrollView if desired */
  scrollViewProps?: VAScrollViewProps
  /** Optional TestID for scrollView */
  testID?: string
}

export type FeatureLandingProps = ChildTemplateProps // Passthrough to same props

export const ChildTemplate: FC<ChildTemplateProps> = ({
  backLabel,
  backLabelA11y,
  backLabelTestID,
  backLabelOnPress,
  title,
  titleA11y,
  headerButton,
  children,
  footerContent,
  scrollViewProps,
  testID,
}) => {
  const insets = useSafeAreaInsets()
  const fontScale = useWindowDimensions().fontScale
  const theme = useTheme()
  const screenReaderEnabled = useIsScreenReaderEnabled(true)

  const [scrollOffset, setScrollOffset] = useState(0)
  const [trackScrollOffset, setTrackScrollOffset] = useState(true)
  const [transitionHeaderHeight, setTransitionHeaderHeight] = useState(0)

  const fillStyle: ViewStyle = {
    paddingTop: insets?.top,
    backgroundColor: theme.colors.background.main,
    flex: 1,
  }

  const headerProps: HeaderBannerProps = {
    leftButton: { text: backLabel, a11yLabel: backLabelA11y, testID: backLabelTestID, onPress: backLabelOnPress, descriptiveBack: true },
    title: { type: 'Transition', title, a11yLabel: titleA11y, scrollOffset, transitionHeaderHeight },
    rightButton: headerButton ? { text: headerButton.label, a11yLabel: headerButton.labelA11y, onPress: headerButton.onPress, icon: headerButton.icon } : undefined,
  }

  const subtitleProps: TextViewProps = {
    variant: 'BitterBoldHeading',
    mt: 0,
    ml: theme.dimensions.condensedMarginBetween,
    mb: theme.dimensions.standardMarginBetween,
    mr: theme.dimensions.condensedMarginBetween,
    accessible: false,
    importantForAccessibility: 'no-hide-descendants',
  }

  /**
   * Handles controlling transitioning header functionality
   * @param offsetValue - The scroll offset position in pixels
   */
  const transitionHeader = (offsetValue: number) => {
    if (offsetValue <= transitionHeaderHeight || trackScrollOffset) {
      setScrollOffset(offsetValue)
      // Stops tracking scroll offset outside the relevant range so more scrolling doesn't prevent animation rendering
      setTrackScrollOffset(offsetValue < transitionHeaderHeight)
    }
  }

  /**
   * At (re)render time, gets and sets the height for transitioning header behavior
   * @param event - Layout change event wrapping the subtitle
   */
  const getTransitionHeaderHeight = (event: LayoutChangeEvent) => {
    // Subtract out bottom padding and 1/3 scaled font line height to closely align transition before subtitle fully disappearing
    const partialFontHeight = (theme.fontSizes.BitterBoldHeading.lineHeight * fontScale) / 3
    const height = event.nativeEvent.layout.height - theme.dimensions.standardMarginBetween - partialFontHeight
    setTransitionHeaderHeight(height)
  }

  return (
    <View style={fillStyle}>
      <StatusBar translucent barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background.main} />
      <HeaderBanner {...headerProps} />

      <>
        <VAScrollView
          testID={testID}
          scrollEventThrottle={1}
          onScroll={(event) => {
            transitionHeader(event.nativeEvent.contentOffset.y)
          }}
          {...scrollViewProps}>
          <View onLayout={getTransitionHeaderHeight}>{!screenReaderEnabled ? <TextView {...subtitleProps}>{title}</TextView> : null}</View>
          {children}
        </VAScrollView>
        {footerContent}
      </>
    </View>
  )
}

export const FeatureLandingTemplate: FC<FeatureLandingProps> = ChildTemplate // Passthrough to same template component
