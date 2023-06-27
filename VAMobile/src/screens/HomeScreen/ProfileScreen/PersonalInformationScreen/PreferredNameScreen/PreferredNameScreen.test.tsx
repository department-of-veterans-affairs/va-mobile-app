import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, render, RenderAPI } from 'testUtils'

import PreferredNameScreen from './PreferredNameScreen'
import { VATextInput } from 'components'

context('PreferredNameScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(async () => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })
    component = render(<PreferredNameScreen {...props} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('text input is setup correctly', async () => {
    const textInput = testInstance.findAllByType(VATextInput)[0]
    expect(textInput.props.value).toEqual('')
    expect(textInput.props.labelKey).toEqual('personalInformation.preferredNameScreen.body')
  })
})
