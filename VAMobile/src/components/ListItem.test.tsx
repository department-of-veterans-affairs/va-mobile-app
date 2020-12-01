import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import renderer, { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { TestProviders, context, findByTestID } from 'testUtils'
import ListItem from './ListItem'

context('ListItem', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})
    act(() => {
      component = renderer.create(
        <TestProviders>
          <ListItem listOfText={[{ text: 'My Title' }]} a11yHint={'a11y'} onPress={onPressSpy} />
        </TestProviders>,
      )
    })
    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call onPress', async () => {
    testInstance.findByType(ListItem).props.onPress()
    expect(onPressSpy).toBeCalled()
  })
})
