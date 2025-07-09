import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { RefillStatus, RefillStatusConstants } from 'api/types'
import StatusDefinition from 'screens/HealthScreen/Pharmacy/StatusDefinition/StatusDefinition'
import { context, mockNavProps, render } from 'testUtils'
import { a11yLabelVA } from 'utils/a11yLabel'

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
    jest.advanceTimersByTime(50)
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
