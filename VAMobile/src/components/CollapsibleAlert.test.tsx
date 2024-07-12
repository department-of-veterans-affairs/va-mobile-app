import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import CollapsibleAlert from './CollapsibleAlert'
import TextView from './TextView'

context('CollapsibleAlert', () => {
  beforeEach(() => {
    render(
      <CollapsibleAlert
        border="informational"
        headerText="HEADER"
        body={<TextView>EXPANDED</TextView>}
        a11yLabel="A11YLABEL"
      />,
    )
  })

  it('renders header text', () => {
    expect(screen.getByRole('tab', { name: 'HEADER' })).toBeTruthy()
  })

  it('shows body text when pressed', () => {
    fireEvent.press(screen.getByRole('tab', { name: 'HEADER' }))
    expect(screen.getByText('EXPANDED')).toBeTruthy()
  })
})
