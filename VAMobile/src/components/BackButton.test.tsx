import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { TouchableWithoutFeedback } from 'react-native'
import { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { context, render, RenderAPI, waitFor } from 'testUtils'
import BackButton from './BackButton'
import VAIcon from './VAIcon'
import { BackButtonLabel, BackButtonLabelConstants } from 'constants/backButtonLabels'

context('BackButton', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  const initializeTestInstance = (canGoBack: boolean, showCarat?: boolean, a11yHint?: string, label?: BackButtonLabel): void => {
    onPressSpy = jest.fn(() => {})

    component = render(<BackButton onPress={onPressSpy} label={label || BackButtonLabelConstants.back} canGoBack={canGoBack} showCarat={showCarat} a11yHint={a11yHint} />)

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance(true)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when canGoBack is false', () => {
    it('should return null', async () => {
      initializeTestInstance(false)

      testInstance = component.UNSAFE_root
      expect(component.toJSON()).toBeFalsy()
    })
  })

  describe('when the onPress is clicked', () => {
    it('should call the onPress function', async () => {
      await waitFor(() => {
        testInstance.findByType(TouchableWithoutFeedback).props.onPress()
        expect(onPressSpy).toBeCalled()
      })
    })
  })

  describe('when showCarat is true', () => {
    it('should render the VAIcon component', async () => {
      initializeTestInstance(true, true)
      expect(testInstance.findAllByType(VAIcon).length).toEqual(1)
    })
  })

  describe('when a11yHint exists', () => {
    it('should set the hint to the one specified', async () => {
      initializeTestInstance(true, false, 'action on click')
      expect(testInstance.findByType(TouchableWithoutFeedback).props.accessibilityHint).toEqual('action on click')
    })
  })

  describe('when a11yHint does not exist', () => {
    describe('when the label is back', () => {
      it('should set the hint to "Navigates to the previous page"', async () => {
        initializeTestInstance(true, undefined, undefined, BackButtonLabelConstants.back)
        expect(testInstance.findByType(TouchableWithoutFeedback).props.accessibilityHint).toEqual('Navigates to the previous page')
      })
    })

    describe('when the label is cancel', () => {
      it('should set the hint to "Cancels changes and navigates to the previous page"', async () => {
        initializeTestInstance(true, undefined, undefined, BackButtonLabelConstants.cancel)
        expect(testInstance.findByType(TouchableWithoutFeedback).props.accessibilityHint).toEqual('Cancels changes and navigates to the previous page')
      })
    })

    describe('when the label is done', () => {
      it('should set the hint to "Exits out of the web view and navigates to the previous page"', async () => {
        initializeTestInstance(true, undefined, undefined, BackButtonLabelConstants.done)
        expect(testInstance.findByType(TouchableWithoutFeedback).props.accessibilityHint).toEqual('Exits out of the web view and navigates to the previous page')
      })
    })
  })
})
