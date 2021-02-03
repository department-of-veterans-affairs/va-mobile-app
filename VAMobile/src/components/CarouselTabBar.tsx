import { Pressable } from 'react-native'
import React, { FC, useState } from 'react'

import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TFunction } from 'i18next'

import { Box, TextView } from './index'
import { CarouselScreen } from './Carousel'
import { useTheme } from 'utils/hooks'

type CarouselTabBarProps = {
  /** the tab navigators current state */
  state: TabNavigationState

  /** the tab navigators navigation helpers */
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>

  /** called when the skip button is clicked or the user has gone through all the carousel components */
  onCarouselEnd: () => void

  /** useTranslations t function to translate the labels */
  translation: TFunction

  /** list of screens with the screen name and the component in each item */
  screenList: Array<CarouselScreen>
}

const CarouselTabBar: FC<CarouselTabBarProps> = ({ state, navigation, onCarouselEnd, screenList }) => {
  const theme = useTheme()
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0)

  const onNextScreen = (): void => {
    const updatedIndex = currentScreenIndex + 1

    if (updatedIndex === screenList.length) {
      onCarouselEnd()
      return
    }

    setCurrentScreenIndex(updatedIndex)
    navigation.navigate(screenList[updatedIndex].name)
  }

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background.splashScreen }} edges={['bottom']}>
      <Box flexDirection="row" height={56} justifyContent="space-between" backgroundColor="splashScreen" alignItems="center" mx={theme.dimensions.gutter}>
        <Pressable onPress={onCarouselEnd}>
          <TextView variant="MobileBody" color="primaryContrast">
            Skip
          </TextView>
        </Pressable>
        <Pressable onPress={onNextScreen}>
          <TextView variant="MobileBody" color="primaryContrast">
            Continue
          </TextView>
        </Pressable>
      </Box>
    </SafeAreaView>
  )
}

export default CarouselTabBar
