import React, { FC, ReactElement } from 'react'

import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import { TFunction } from 'i18next'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import _ from 'underscore'

import CarouselTabBar from './CarouselTabBar'

const CarouselTabNav = createBottomTabNavigator()
const CarouselStack = createStackNavigator()

export type CarouselScreen = {
  /** name of component */
  name: string

  /** component to display in carousel */
  component: FC<{}>

  /** optional accessibility hints for the skip button, continue button, and carousel indicators progress bar */
  a11yHints?: {
    skipHint?: string
    carouselIndicatorsHint?: string
    continueHint?: string
  }
}

type CarouselStackComponentProps = {
  /** list of screens with the screen name and the component in each item */
  screenList: Array<CarouselScreen>
}

const CarouselStackComponent: FC<CarouselStackComponentProps> = ({ screenList }) => {
  return (
    <CarouselStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      {_.map(screenList, (screen, index) => {
        return <CarouselStack.Screen name={screen.name as never} component={screen.component} key={index} />
      })}
    </CarouselStack.Navigator>
  )
}

type CarouselProps = {
  screenList: Array<CarouselScreen>
  onCarouselEnd: () => void
  translation: TFunction
}

const Carousel: FC<CarouselProps> = ({ screenList, onCarouselEnd, translation }) => {
  return (
    <CarouselTabNav.Navigator tabBar={(props): React.ReactNode => <CarouselTabBar {...props} onCarouselEnd={onCarouselEnd} translation={translation} screenList={screenList} />}>
      <CarouselTabNav.Screen name="Main" children={(): ReactElement => <CarouselStackComponent screenList={screenList} />} />
    </CarouselTabNav.Navigator>
  )
}

export default Carousel
