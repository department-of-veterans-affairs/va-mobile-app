import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { context, renderWithProviders } from 'testUtils'
import VAButton from './VAButton'
import Box from './Box'

context('VAButton', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  const initializeTestInstance = (disabled?: boolean): void => {
    onPressSpy = jest.fn(() => {})

    act(() => {
      component = renderWithProviders(<VAButton label={'my bytton'} onPress={onPressSpy} textColor="primaryContrast" backgroundColor="button" disabled={disabled} />)
    })
    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call onChange', async () => {
    testInstance.findByType(VAButton).props.onPress()
    expect(onPressSpy).toBeCalled()
  })

  describe('when disabled is true', () => {
    it('should set the background color to "disabledButton"', async () => {
      initializeTestInstance(true)
      expect(testInstance.findByType(Box).props.backgroundColor).toEqual('disabledButton')
    })
  })

  describe('when disabled is false', () => {
    it('should set the background color to the color passed into the props', async () => {
      initializeTestInstance(false)
      expect(testInstance.findByType(Box).props.backgroundColor).toEqual('button')
    })
  })
})
