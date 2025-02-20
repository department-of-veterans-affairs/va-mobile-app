import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { RefillStatus, RefillStatusConstants } from 'api/types'
import { context, mockNavProps, render } from 'testUtils'
import { a11yLabelVA } from 'utils/a11yLabel'

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
    expect(screen.getByRole('header', { name: 'Active' })).toBeTruthy()
    expect(screen.getByLabelText(a11yLabelVA(t('statusDefinition.active')))).toBeTruthy()
  })
})
