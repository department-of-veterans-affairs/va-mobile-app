import React from 'react'

import { TimeFrameTypeConstants } from 'constants/timeframes'
import TravelPayClaimsDatePicker from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsDatePicker'
import { context, fireEvent, render, screen } from 'testUtils'

const mockOnTimeFrameChanged = jest.fn()

context('TravelPayClaimsDatePicker', () => {
  beforeEach(() => {
    mockOnTimeFrameChanged.mockClear()
  })

  const initializeTestInstance = () => {
    render(
      <TravelPayClaimsDatePicker
        timeFrame={TimeFrameTypeConstants.LAST_3_MONTHS}
        onTimeFrameChanged={mockOnTimeFrameChanged}
      />,
    )
  }

  it('renders the picker', () => {
    initializeTestInstance()

    expect(screen.getByTestId('getDateRangeTestID')).toBeTruthy()
    fireEvent.press(screen.getByRole('spinbutton'))
    fireEvent.press(screen.getByRole('button', { name: 'Done' }))
    expect(mockOnTimeFrameChanged).toHaveBeenCalled()
  })
})
