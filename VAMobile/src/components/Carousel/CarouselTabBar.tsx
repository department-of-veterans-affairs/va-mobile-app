import React, { ReactElement, useState } from 'react'
import { Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import { NavigationHelpers, ParamListBase } from '@react-navigation/native'

import { TFunction } from 'i18next'
import styled from 'styled-components'
import _ from 'underscore'

import { Box, BoxProps, CarouselScreen, TextView } from 'components'
import { a11yHintProp } from 'utils/accessibility'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { themeFn } from 'utils/theme'

const StyledSafeAreaView = styled(SafeAreaView)`
  background-color: ${themeFn((theme) => theme.colors.background.carousel)};
`

const StyledPressable = styled(Pressable)`
  min-height: ${themeFn((theme) => theme.dimensions.touchableMinHeight)}px;
  justify-content: center;
`

type CarouselTabBarProps = {
  /** the tab navigators navigation helpers */
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>

  /** called when the skip button is clicked or the user has gone through all the carousel components */
  onCarouselEnd: () => void

  /** useTranslations t function to translate the labels */
  translation: TFunction

  /** list of screens with the screen name and the component in each item */
  screenList: Array<CarouselScreen>
}

/**A common component with the carousel tab bar content. Displays skip button, continue button, and a progress bar*/
function CarouselTabBar({ onCarouselEnd, screenList, translation }: CarouselTabBarProps) {
  const theme = useTheme()
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0)
  const a11yHints = screenList[currentScreenIndex].a11yHints
  const navigateTo = useRouteNavigation()

  const onContinue = (): void => {
    const updatedIndex = currentScreenIndex + 1

    if (updatedIndex === screenList.length) {
      onCarouselEnd()
      return
    }

    setCurrentScreenIndex(updatedIndex)
    navigateTo(screenList[updatedIndex].name)
  }

  const goBack = (): void => {
    const updatedIndex = currentScreenIndex - 1
    setCurrentScreenIndex(updatedIndex)
    navigateTo(screenList[updatedIndex].name)
  }

  const getProgressBar = (): ReactElement[] => {
    return _.map(screenList, (screen, index) => {
      const boxProps: BoxProps = {
        width: 12,
        height: 12,
        borderRadius: 6,
        opacity: index === currentScreenIndex ? 1 : 0.5,
        m: 6,
        backgroundColor: 'carouselTab',
      }

      return <Box {...boxProps} key={index} />
    })
  }

  const goBackOrSkipBtn = () => {
    let onPressCallback: () => void
    let buttonText: string
    let allyHint: string | undefined

    if (currentScreenIndex === 0) {
      onPressCallback = onCarouselEnd
      buttonText = 'skip'
      allyHint = a11yHints?.skipHint
    } else {
      onPressCallback = goBack
      buttonText = 'back'
      allyHint = a11yHints?.backHint
    }

    return (
      // eslint-disable-next-line react-native-a11y/has-accessibility-hint
      <StyledPressable
        onPress={onPressCallback}
        accessibilityLabel={translation(buttonText)}
        testID="onboardingSkipBackButtonID"
        accessibilityRole="link"
        {...a11yHintProp(allyHint || '')}>
        <TextView variant="MobileBody" color="primaryContrast" allowFontScaling={false} mr="auto" selectable={false}>
          {translation(buttonText)}
        </TextView>
      </StyledPressable>
    )
  }

  const nextOrDoneBtn = () => {
    let buttonText: string
    let allyHint: string | undefined

    if (currentScreenIndex === screenList.length - 1) {
      buttonText = 'done'
      allyHint = a11yHints?.doneHint
    } else {
      buttonText = 'next'
      allyHint = a11yHints?.continueHint
    }

    return (
      // eslint-disable-next-line react-native-a11y/has-accessibility-hint
      <StyledPressable
        onPress={onContinue}
        accessibilityLabel={translation(buttonText)}
        testID="onboardingDoneNextButtonID"
        accessibilityRole="link"
        {...a11yHintProp(allyHint || '')}>
        <TextView
          variant="MobileBodyBold"
          color="primaryContrast"
          allowFontScaling={false}
          ml="auto"
          selectable={false}>
          {translation(buttonText)}
        </TextView>
      </StyledPressable>
    )
  }

  const progressBarContainerProps: BoxProps = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    accessibilityRole: 'progressbar',
    accessible: true,
    minHeight: theme.dimensions.touchableMinHeight,
  }

  return (
    <StyledSafeAreaView edges={['bottom']}>
      <Box
        display="flex"
        flexDirection="row"
        height={70}
        backgroundColor="carousel"
        alignItems="center"
        mx={theme.dimensions.gutter}>
        <Box flex={1} display="flex" justifyContent="center">
          {goBackOrSkipBtn()}
        </Box>
        <Box
          testID={'carouselIndicators'}
          {...a11yHintProp(a11yHints?.carouselIndicatorsHint || '')}
          {...progressBarContainerProps}>
          {getProgressBar()}
        </Box>
        <Box flex={1} display="flex" justifyContent="center">
          {nextOrDoneBtn()}
        </Box>
      </Box>
    </StyledSafeAreaView>
  )
}

export default CarouselTabBar
