import 'react-native'
import React from 'react'

import { context, render, mockNavProps } from 'testUtils'
import { screen } from '@testing-library/react-native'
import ConsolidatedClaimsNote from './ConsolidatedClaimsNote'

context('ConsolidatedClaimsNote', () => {
  beforeEach(() => {
    const props = mockNavProps(undefined, { setOptions: jest.fn() })
    render(<ConsolidatedClaimsNote {...props} />)
  })

  it('initializes correctly', async () => {
    expect(screen.getByText('A note about consolidated claims')).toBeTruthy()
    expect(screen.getByText("If you turn in a new claim while we’re reviewing another one from you, we’ll add any new information to the original claim and close the new claim, with no action required from you.")).toBeTruthy()
  })
})
