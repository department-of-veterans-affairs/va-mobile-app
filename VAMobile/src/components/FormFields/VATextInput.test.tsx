import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { context, renderWithProviders } from 'testUtils'
import VATextInput from './VATextInput'

context('VATextInput', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onChangeSpy: Mock

  beforeEach(() => {
    onChangeSpy = jest.fn(() => {})

    act(() => {
      component = renderWithProviders(<VATextInput inputType="email" onChange={onChangeSpy} labelKey={'profile:personalInformation.emailAddress'} />)
    })
    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call onChange', async () => {
    testInstance.findByType(VATextInput).props.onChange()
    expect(onChangeSpy).toBeCalled()
  })
})
