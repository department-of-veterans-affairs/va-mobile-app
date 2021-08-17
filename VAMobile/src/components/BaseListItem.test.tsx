import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { Pressable } from 'react-native'
import renderer, { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import Box, { BackgroundVariant } from './Box'
import { TestProviders, context, findByTestID } from 'testUtils'
import BaseListItem from './BaseListItem'
import { TextLines } from './TextLines'

context('BaseListItem', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  const initializeTestInstance = (backgroundColor?: BackgroundVariant, activeBackgroundColor?: BackgroundVariant): void => {
    onPressSpy = jest.fn(() => {})
    act(() => {
      component = renderer.create(
        <TestProviders>
          <BaseListItem a11yHint={'a11y'} onPress={onPressSpy} backgroundColor={backgroundColor} activeBackgroundColor={activeBackgroundColor}>
            <TextLines listOfText={[{ text: 'My Title' }]} />
          </BaseListItem>
        </TestProviders>,
      )
    })
    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call onPress', async () => {
    testInstance.findByType(BaseListItem).props.onPress()
    expect(onPressSpy).toBeCalled()
  })

  describe('styling', () => {
    it('should set default background colors', async () => {
      expect(testInstance.findByType(Box).props.backgroundColor).toEqual('list')
      testInstance.findByType(Pressable).props.onPressIn()
      expect(testInstance.findByType(Box).props.backgroundColor).toEqual('listActive')
    })

    it('should set custom background colors', async () => {
      initializeTestInstance('completedPhase', 'currentPhase')
      expect(testInstance.findByType(Box).props.backgroundColor).toEqual('completedPhase')
      testInstance.findByType(Pressable).props.onPressIn()
      expect(testInstance.findByType(Box).props.backgroundColor).toEqual('currentPhase')
    })
  })
})
