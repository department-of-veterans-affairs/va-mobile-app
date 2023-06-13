import 'react-native'
import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { render } from 'testUtils'
import SelectionList from './SelectionList'
import { TextView } from '../index'

describe('SelectionList', () => {
  beforeEach(() => {
    const items = [{ content: <TextView>One</TextView> }, { content: <TextView>Two</TextView> }]
    render(<SelectionList items={items} />)
  })

  it('renders items', () => {
    expect(screen.getByText('One')).toBeTruthy()
    expect(screen.getByText('Two')).toBeTruthy()
  })

  it('toggles items when "Select all" is pressed', () => {
    fireEvent.press(screen.getByText('Select all'))
    expect(screen.getByRole('checkbox', { name: 'One', checked: true })).toBeTruthy()
    expect(screen.getByRole('checkbox', { name: 'Two', checked: true })).toBeTruthy()
    expect(screen.getByText('2/2 selected')).toBeTruthy()

    fireEvent.press(screen.getByText('Select all'))
    expect(screen.getByRole('checkbox', { name: 'One', checked: false })).toBeTruthy()
    expect(screen.getByRole('checkbox', { name: 'Two', checked: false })).toBeTruthy()
    expect(screen.getByText('0/2 selected')).toBeTruthy()
  })
})
