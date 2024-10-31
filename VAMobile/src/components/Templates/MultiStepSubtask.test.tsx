import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import TextView from 'components/TextView'
import { context, render, screen } from 'testUtils'

import MultiStepSubtask from './MultiStepSubtask'

context('MultiStepSubtask', () => {
  type TestStackParams = {
    TestScreen: undefined
  }

  const TestStackNavigator = createStackNavigator<TestStackParams>()

  const TestScreen = () => {
    return <TextView>This is the screen</TextView>
  }

  beforeEach(() => {
    render(
      <MultiStepSubtask<TestStackParams> stackNavigator={TestStackNavigator}>
        <TestStackNavigator.Screen name="TestScreen" component={TestScreen} />
      </MultiStepSubtask>,
    )
  })

  it('renders child screen inside provided StackNavigator', () => {
    expect(screen.getByText('This is the screen')).toBeTruthy()
  })
})
