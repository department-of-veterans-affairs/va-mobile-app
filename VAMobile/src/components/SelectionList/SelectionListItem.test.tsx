import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import SelectionListItem from './SelectionListItem'

context('SelectionListItem', () => {
  const onSelectSpy = jest.fn()

  const renderWithProps = (isSelected = false) => {
    render(<SelectionListItem isSelected={isSelected} setSelectedFn={onSelectSpy} />)
  }

  it('shows item', () => {
    renderWithProps()
    expect(screen.getByRole('checkbox', { checked: false })).toBeTruthy()
  })

  it('calls onPress when pressed', () => {
    renderWithProps()
    fireEvent.press(screen.getByRole('checkbox', { checked: false }))
    expect(onSelectSpy).toHaveBeenCalled()
  })

  it('sets accessibilityState correctly when selected', () => {
    renderWithProps(true)
    expect(screen.getByRole('checkbox', { checked: true })).toBeTruthy()
  })
})
