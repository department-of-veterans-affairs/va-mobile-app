import React, { FC, ReactNode, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutChangeEvent, StatusBar, View, ViewStyle, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useIsScreenReaderEnabled } from '@department-of-veterans-affairs/mobile-component-library'

import {
  HeaderBanner,
  HeaderBannerProps,
  HeaderButton,
  LoadingComponent,
  TextView,
  TextViewProps,
  WaygateWrapper,
} from 'components'
import ErrorComponent, { ErrorComponentProps } from 'components/CommonErrorComponents/ErrorComponent'
import VAScrollView, { VAScrollViewProps } from 'components/VAScrollView'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypes } from 'store/api'
import { useTheme } from 'utils/hooks'

/* To use these templates:
1. Wrap the screen content you want in <FeatureLandingTemplate> </FeatureLandingTemplate> or <ChildTemplate> </ChildTemplate> and
  supply the appropriate props for desired functionality
2. In the screen navigator update 'screenOptions={{ headerShown: false }}' to hide the previous navigation display for all screens in the navigator.
  Use 'options={{headerShown: false}}'(preferred method for subtask) in the individual screen if only an individual screen is supposed to do it.
*/
export type ScreenError = Partial<ErrorComponentProps> & {
  /** Boolean to determine if error should be displayed */
  errorCheck: boolean
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
  headerButton?: HeaderButton
  /** Optional footer content pinned below the scrollable space */
  footerContent?: ReactNode
  /** Optional ScrollView props to pass through to VAScrollView if desired */
  scrollViewProps?: VAScrollViewProps
  /** Optional TestID for scrollView */
  testID?: string
  /** Optional boolean to display loading component */
  isLoading?: boolean
  /** Optional text for loading screen */
  loadingText?: string
  /** Optional screen id for the screen that has errors*/
  screenID?: ScreenIDTypes
  /** Optional array of errors to be handled by the given screen */
  errors?: Array<ScreenError>
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
  isLoading,
  loadingText,
  screenID,
  errors,
}) => {
  const insets = useSafeAreaInsets()
  const fontScale = useWindowDimensions().fontScale
  const theme = useTheme()
  const screenReaderEnabled = useIsScreenReaderEnabled()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const [scrollOffset, setScrollOffset] = useState(0)
  const [trackScrollOffset, setTrackScrollOffset] = useState(true)
  const [transitionHeaderHeight, setTransitionHeaderHeight] = useState(0)

  const fillStyle: ViewStyle = {
    paddingTop: insets?.top,
    backgroundColor: theme.colors.background.main,
    flex: 1,
  }

  const headerProps: HeaderBannerProps = {
    leftButton: {
      text: backLabel,
      a11yLabel: backLabelA11y
        ? t('back.a11yLabel', { screenName: backLabelA11y })
        : t('back.a11yLabel', { screenName: backLabel }),
      testID: backLabelTestID,
      onPress: backLabelOnPress,
      descriptiveBack: true,
    },
    title: { type: 'Transition', title, a11yLabel: titleA11y, scrollOffset, transitionHeaderHeight },
    rightButton: headerButton
      ? {
          text: headerButton.label,
          a11yLabel: headerButton.labelA11y,
          onPress: headerButton.onPress,
          icon: headerButton.icon,
          testID: headerButton.testID,
        }
      : undefined,
  }

  const subtitleProps: TextViewProps = {
    variant: 'BitterHeading',
    mt: 0,
    mx: theme.dimensions.gutter,
    mb: theme.dimensions.standardMarginBetween,
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

  /**
   * Determines if there is an error to display based on the provided errors array.
   * If a valid error with `errorCheck` is found, it renders the ErrorComponent.
   */
  const errorToDisplay = useMemo(() => {
    if (!errors || !screenID) return null
    const screenError = errors.find((error) => error.errorCheck)
    return (
      screenError && (
        <ErrorComponent screenID={screenID} onTryAgain={screenError.onTryAgain} error={screenError.error} />
      )
    )
  }, [errors, screenID])

  const renderContent = () => {
    if (isLoading) return <LoadingComponent text={loadingText} />
    if (errorToDisplay) return errorToDisplay
    return children
  }

  return (
    <View style={fillStyle}>
      <StatusBar
        translucent
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background.main}
      />
      <HeaderBanner {...headerProps} />
      <VAScrollView
        testID={testID}
        scrollEventThrottle={1}
        onScroll={(event) => {
          transitionHeader(event.nativeEvent.contentOffset.y)
        }}
        {...scrollViewProps}>
        {!screenReaderEnabled ? (
          // eslint-disable-next-line react-native-a11y/has-accessibility-hint
          <View accessible accessibilityLabel={titleA11y} onLayout={getTransitionHeaderHeight}>
            <TextView {...subtitleProps}>{title}</TextView>
          </View>
        ) : null}
        <WaygateWrapper>{renderContent()}</WaygateWrapper>
      </VAScrollView>
      <WaygateWrapper bypassAlertBox={true}>{footerContent}</WaygateWrapper>
    </View>
  )
}

export const FeatureLandingTemplate: FC<FeatureLandingProps> = ChildTemplate // Passthrough to same template component
