import React, { FC, ReactElement } from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'

import { TFunction } from 'i18next'
import _ from 'underscore'

import CarouselTabBar from 'components/Carousel/CarouselTabBar'

const CarouselTabNav = createBottomTabNavigator()
const CarouselStack = createStackNavigator()

export type CarouselScreen = {
  /** name of component */
  name: string

  /** component to display in carousel */
  component: FC<Record<string, unknown>>

  /** optional accessibility hints for the skip button, continue button, and carousel indicators progress bar */
  a11yHints?: {
    skipHint?: string
    carouselIndicatorsHint?: string
    continueHint?: string
    doneHint?: string
    backHint?: string
  }
}

type CarouselStackComponentProps = {
  /** list of screens with the screen name and the component in each item */
  screenList: Array<CarouselScreen>
}

function CarouselStackComponent({ screenList }: CarouselStackComponentProps) {
  return (
    <CarouselStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        detachPreviousScreen: false,
      }}>
      {_.map(screenList, (screen, index) => {
        return <CarouselStack.Screen name={screen.name as never} component={screen.component} key={index} />
      })}
    </CarouselStack.Navigator>
  )
}

type CarouselProps = {
  /** list of screens with the screen name and the component in each item */
  screenList: Array<CarouselScreen>

  /** called when the skip button is clicked or the user has gone through all the carousel components */
  onCarouselEnd: () => void

  /** useTranslations t function to translate the labels */
  translation: TFunction
}

/** A common component to set up a carousel of screens and display a carousel tab at the bottom of the screen,
 * which displays a skip button, continue button, and a progress bar */
function Carousel({ screenList, onCarouselEnd, translation }: CarouselProps) {
  return (
    <CarouselTabNav.Navigator
      tabBar={(props): React.ReactNode => (
        <CarouselTabBar {...props} onCarouselEnd={onCarouselEnd} translation={translation} screenList={screenList} />
      )}>
      <CarouselTabNav.Screen
        name="Main"
        children={(): ReactElement => <CarouselStackComponent screenList={screenList} />}
        options={{ headerShown: false }}
      />
    </CarouselTabNav.Navigator>
  )
}

export default Carousel
