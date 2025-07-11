import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import RadioGroupModal, { RadioGroupModalProps, RadioPickerGroup } from 'components/RadioGroupModal'
import { context, render } from 'testUtils'

context('RadioGroupModal', () => {
  const onSetSpy = jest.fn()
  const onApplySpy = jest.fn()
  const onCancelSpy = jest.fn()

  beforeEach(() => {
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
      onApply: onApplySpy,
      onCancel: onCancelSpy,
      buttonText: 'Modal button',
      headerText: 'Modal header',
    }

    render(<RadioGroupModal {...modalProps} />)
    fireEvent.press(screen.getByRole('button', { name: 'Modal button' }))
  })

  it('renders modal header and group title', () => {
    jest.advanceTimersByTime(50)
    expect(screen.getByRole('header', { name: 'Modal header' })).toBeTruthy()
    expect(screen.getAllByRole('header', { name: 'Group 1 title' })[0]).toBeTruthy()
  })

  it('calls onCancel and closes modal when Cancel is pressed', () => {
    fireEvent.press(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancelSpy).toHaveBeenCalled()
    expect(screen.queryByRole('header', { name: 'Modal header' })).toBeFalsy()
  })

  it('calls onApply and closes modal when Apply is pressed', () => {
    fireEvent.press(screen.getByRole('button', { name: 'Apply' }))
    expect(onApplySpy).toHaveBeenCalled()
    expect(screen.queryByRole('header', { name: 'Modal header' })).toBeFalsy()
  })

  it('renders options with roles and a11yLabels', () => {
    jest.advanceTimersByTime(50)
    expect(screen.getByRole('radio', { name: 'Option One' })).toBeTruthy()
    expect(screen.getByLabelText('Option One option 1 of 2')).toBeTruthy()
    expect(screen.getByRole('radio', { name: 'Option Two' })).toBeTruthy()
    expect(screen.getByLabelText('Option Two option 2 of 2')).toBeTruthy()
  })

  it('calls onSetOption when option is pressed', () => {
    jest.advanceTimersByTime(50)
    fireEvent.press(screen.getByRole('radio', { name: 'Option One' }))
    expect(onSetSpy).toHaveBeenCalledWith('option-one')
    fireEvent.press(screen.getByRole('radio', { name: 'Option Two' }))
    expect(onSetSpy).toHaveBeenCalledWith('option-two')
  })
})
