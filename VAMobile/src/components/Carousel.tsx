import React, { FC } from 'react'

import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import { TFunction } from 'i18next'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import _ from 'underscore'

import CarouselTabBar from './CarouselTabBar'

const CarouselTabNav = createBottomTabNavigator()
const CarouselStack = createStackNavigator()

export type CarouselScreen = {
  name: string
  component: FC<{}>
}

type CarouselStackComponentProps = {
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
      <CarouselTabNav.Screen name="Main" children={() => <CarouselStackComponent screenList={screenList} />} />
    </CarouselTabNav.Navigator>
  )
}

export default Carousel
