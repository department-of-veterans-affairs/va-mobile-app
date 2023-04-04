import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'

import { context, mockNavProps, render, RenderAPI } from 'testUtils'
import { RadioGroup, TextView, VAButton } from 'components'
import { InitialState } from 'store/slices'
import GenderIdentityScreen from './GenderIdentityScreen'

context('GenderIdentityScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(() => {
    const props = mockNavProps()
    const store = {
      ...InitialState,
    }

    component = render(<GenderIdentityScreen {...props} />, {preloadedState: store})
    testInstance = component.container
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('sets up radio group correctly', async () => {
    const radioGroup = testInstance.findAllByType(RadioGroup)[0]
    expect(radioGroup.props.value).toEqual(undefined)
  })

  it('sets error on save when a gender identity type has not been selected', async () => {
    act(() => {
      testInstance.findAllByType(VAButton)[0].props.onPress()
    })
    const textViews = testInstance.findAllByType(TextView)
    expect(textViews[4].props.children).toEqual('Select an option')
  })
})
