import { Pressable } from 'react-native'
import React, { FC, ReactElement, useState } from 'react'

import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import { NavigationHelpers, ParamListBase } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TFunction } from 'i18next'
import _ from 'underscore'
import styled from 'styled-components/native'

import { Box, BoxProps, TextView } from './index'
import { CarouselScreen } from './Carousel'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { themeFn } from 'utils/theme'
import { useTheme } from 'utils/hooks'

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

const CarouselTabBar: FC<CarouselTabBarProps> = ({ navigation, onCarouselEnd, screenList, translation }) => {
  const theme = useTheme()
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0)

  const onContinue = (): void => {
    const updatedIndex = currentScreenIndex + 1

    if (updatedIndex === screenList.length) {
      onCarouselEnd()
      return
    }

    setCurrentScreenIndex(updatedIndex)
    navigation.navigate(screenList[updatedIndex].name)
  }

  const getProgressBar = (): ReactElement[] => {
    return _.map(screenList, (screen, index) => {
      const boxProps: BoxProps = {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        opacity: index === currentScreenIndex ? 1 : 0.5,
        mr: theme.dimensions.carouselProgressDotsMargin,
        backgroundColor: 'textBox',
      }

      return <Box {...boxProps} key={index} />
    })
  }

  const progressBarContainerProps: BoxProps = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    accessibilityRole: 'progressbar',
    accessible: true,
  }

  const a11yHints = screenList[currentScreenIndex].a11yHints

  return (
    <StyledSafeAreaView edges={['bottom']}>
      <Box display="flex" flexDirection="row" height={70} backgroundColor="carousel" alignItems="center" mx={theme.dimensions.gutter}>
        <Box flex={1} display="flex" justifyContent="center">
          <StyledPressable onPress={onCarouselEnd} accessibilityRole="button" {...a11yHintProp(a11yHints?.skipHint || '')}>
            <TextView variant="MobileBody" color="primaryContrast" allowFontScaling={false} mr="auto">
              {translation('common:skip')}
            </TextView>
          </StyledPressable>
        </Box>
        <Box {...testIdProps(translation('common:carouselIndicators'))} {...a11yHintProp(a11yHints?.carouselIndicatorsHint || '')} {...progressBarContainerProps}>
          {getProgressBar()}
        </Box>
        <Box flex={1} display="flex" justifyContent="center">
          <StyledPressable onPress={onContinue} accessibilityRole="button" {...a11yHintProp(a11yHints?.continueHint || '')}>
            <TextView variant="MobileBody" color="primaryContrast" allowFontScaling={false} ml="auto">
              {translation('common:continue')}
            </TextView>
          </StyledPressable>
        </Box>
      </Box>
    </StyledSafeAreaView>
  )
}

export default CarouselTabBar
