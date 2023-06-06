import 'react-native'
import { Pressable, Switch as RNSwitch } from 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { context, findByOnPressFunction, findByTypeWithText, render, RenderAPI, waitFor } from 'testUtils'
import RadioGroupModal, { RadioGroupModalProps, RadioPickerGroup } from './RadioGroupModal'
import { TextView } from './index'

context('RadioGroupModal', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onSetSpy: Mock
  let onConfirmSpy: Mock
  let onCancelSpy: Mock
  let onResetSpy: Mock

  beforeEach(() => {
    onSetSpy = jest.fn(() => {})
    onConfirmSpy = jest.fn(() => {})
    onCancelSpy = jest.fn(() => {})
    onResetSpy = jest.fn(() => {})

    const group1: RadioPickerGroup = {
      title: 'group 1 title',
      items: [],
      onSetOption: onSetSpy,
    }

    const modalProps: RadioGroupModalProps = {
      groups: [group1],
      onConfirm: onConfirmSpy,
      onUpperRightAction: onResetSpy,
      onCancel: onCancelSpy,
      buttonText: 'modal button',
      headerText: 'modal header',
      topRightButtonText: 'reset',
    }

    component = render(<RadioGroupModal {...modalProps} />)
    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should show the button', async () => {
    expect(findByTypeWithText(testInstance, TextView, 'modal button')).toBeTruthy()
    expect(findByOnPressFunction(testInstance, Pressable, 'showModal')).toBeTruthy()
  })

  // TODO: Issue 4283 should ensure these 3 unit tests are fixed
  // it('should have a functional upper right button', async () => {
  //   expect(findByTypeWithText(testInstance, TextView, 'reset')).toBeTruthy()

  //   await waitFor(() => {
  //     findByOnPressFunction(testInstance, Pressable, 'onUpperRightActionPressed')?.props.onPress()
  //     expect(onResetSpy).toBeCalled()
  //   })
  // })

  // it('should have a functional cancel button', async () => {
  //   expect(findByTypeWithText(testInstance, TextView, 'Cancel')).toBeTruthy()

  //   await waitFor(() => {
  //     findByOnPressFunction(testInstance, Pressable, 'onCancelPressed')?.props.onPress()
  //     expect(onCancelSpy).toBeCalled()
  //   })
  // })

  // it('should call the apply callback', async () => {
  //   expect(findByTypeWithText(testInstance, TextView, 'Apply')).toBeTruthy()

  //   await waitFor(() => {
  //     findByOnPressFunction(testInstance, Pressable, 'onApply')?.props.onPress()
  //     expect(onConfirmSpy).toBeCalled()
  //   })
  // })
})
