import React from 'react'
import { screen } from '@testing-library/react-native'

import { context, render, mockNavProps } from 'testUtils'
import ConsolidatedClaimsNote from './ConsolidatedClaimsNote'

context('ConsolidatedClaimsNote', () => {
  beforeEach(() => {
    const props = mockNavProps(undefined, { setOptions: jest.fn() })
    render(<ConsolidatedClaimsNote {...props} />)
  })

  it('Renders ConsolidatedClaimsNote', () => {
    expect(screen.getByText('A note about consolidated claims')).toBeTruthy()
    expect(screen.getByText("If you turn in a new claim while we’re reviewing another one from you, we’ll add any new information to the original claim and close the new claim, with no action required from you.")).toBeTruthy()
  })
})
