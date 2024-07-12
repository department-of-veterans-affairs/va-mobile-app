import React from 'react'

import { screen } from '@testing-library/react-native'

import { RefillStatus, RefillStatusConstants } from 'api/types'
import { context, mockNavProps, render } from 'testUtils'

import StatusDefinition from './StatusDefinition'

context('StatusDefinition', () => {
  const initializeTestInstance = (routeMock?: { display: string; value: RefillStatus }) => {
    const props = mockNavProps(
      {},
      {
        setOptions: jest.fn(),
        navigate: jest.fn(),
        addListener: jest.fn(),
      },
      { params: routeMock || { display: '', value: 'active' } },
    )

    render(<StatusDefinition {...props} />)
  }

  it('should display a glossary definition for a refill status', () => {
    initializeTestInstance({
      display: 'Active',
      value: RefillStatusConstants.ACTIVE,
    })
    expect(screen.getByText('Active')).toBeTruthy()
    expect(
      screen.getByText(
        'A prescription that can be filled at the local VA pharmacy. If this prescription is refillable, you may request a refill of this VA prescription.',
      ),
    ).toBeTruthy()
  })
})
