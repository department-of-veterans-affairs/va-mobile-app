import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import RadioGroupModal, { RadioGroupModalProps, RadioPickerGroup } from './RadioGroupModal'

context('RadioGroupModal', () => {
  const onSetSpy = jest.fn()
  const onConfirmSpy = jest.fn()
  const onCancelSpy = jest.fn()
  const onResetSpy = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()

    const group1: RadioPickerGroup = {
      title: 'Group 1 title',
      items: [
        { value: 'option-one', labelKey: 'Option One' },
        { value: 'option-two', labelKey: 'Option Two' },
      ],
      onSetOption: onSetSpy,
    }

    const modalProps: RadioGroupModalProps = {
      groups: [group1],
      onConfirm: onConfirmSpy,
      onUpperRightAction: onResetSpy,
      onCancel: onCancelSpy,
      buttonText: 'Modal button',
      headerText: 'Modal header',
      topRightButtonText: 'Reset',
    }

    render(<RadioGroupModal {...modalProps} />)
    fireEvent.press(screen.getByRole('button', { name: 'Modal button' }))
  })

  it('renders modal header and group title', () => {
    expect(screen.getByRole('header', { name: 'Modal header' })).toBeTruthy()
    expect(screen.getAllByRole('header', { name: 'Group 1 title' })[0]).toBeTruthy()
  })

  it('calls onPress and closes modal when Cancel is pressed', () => {
    fireEvent.press(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancelSpy).toHaveBeenCalled()
    expect(screen.queryByRole('header', { name: 'Modal header' })).toBeFalsy()
  })

  it('calls onConfirm and closes modal when Apply is pressed', () => {
    fireEvent.press(screen.getByRole('button', { name: 'Apply' }))
    expect(onConfirmSpy).toHaveBeenCalled()
    expect(screen.queryByRole('header', { name: 'Modal header' })).toBeFalsy()
  })

  it('calls onPress when top right button is pressed', () => {
    fireEvent.press(screen.getByRole('button', { name: 'Reset' }))
    expect(onResetSpy).toHaveBeenCalled()
  })

  it('renders options with roles and a11yLabels', () => {
    expect(screen.getByRole('radio', { name: 'Option One' })).toBeTruthy()
    expect(screen.getByLabelText('Option One option 1 of 2')).toBeTruthy()
    expect(screen.getByRole('radio', { name: 'Option Two' })).toBeTruthy()
    expect(screen.getByLabelText('Option Two option 2 of 2')).toBeTruthy()
  })

  it('calls onSetOption when option is pressed', () => {
    fireEvent.press(screen.getByRole('radio', { name: 'Option One' }))
    expect(onSetSpy).toHaveBeenCalledWith('option-one')
    fireEvent.press(screen.getByRole('radio', { name: 'Option Two' }))
    expect(onSetSpy).toHaveBeenCalledWith('option-two')
  })
})
