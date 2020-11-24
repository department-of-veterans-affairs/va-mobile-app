import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import renderer, { ReactTestInstance, ReactTestRenderer, act } from 'react-test-renderer'
import Mock = jest.Mock

import { TestProviders, context, findByTestID } from 'testUtils'
import HomeNavButton from './HomeNavButton'

context('HomeNavButton', () => {
  let component: ReactTestRenderer
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})
    act(() => {
      component = renderer.create(
        <TestProviders>
          <HomeNavButton title={'My Title'} subText={'My Subtext'} a11yHint={'a11y'} onPress={onPressSpy} />
        </TestProviders>,
      )
    })
    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
    expect(findByTestID(testInstance, 'my-title-title').props.children).toEqual('My Title')
    expect(findByTestID(testInstance, 'my-title-subtext').props.children).toEqual('My Subtext')
  })

  it('should call onPress', async () => {
    testInstance.findByType(HomeNavButton).props.onPress()
    expect(onPressSpy).toBeCalled()
  })
})
