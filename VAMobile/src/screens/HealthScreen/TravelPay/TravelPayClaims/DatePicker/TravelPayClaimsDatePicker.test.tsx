import React from 'react'

import { TimeFrameTypeConstants } from 'constants/timeframes'
import TravelPayClaimsDatePicker from 'screens/HealthScreen/TravelPay/TravelPayClaims/DatePicker/TravelPayClaimsDatePicker'
import { context, fireEvent, render, screen } from 'testUtils'
import { createTimeFrameDateRangeMap } from 'utils/dateUtils'
import { formatDateRangeMMMyyyy } from 'utils/formattingUtils'

const mockOnTimeFrameChanged = jest.fn()

context('TravelPayClaimsDatePicker', () => {
  beforeEach(() => {
    mockOnTimeFrameChanged.mockClear()
  })

  const initializeTestInstance = (timeFrame = TimeFrameTypeConstants.LAST_3_MONTHS) => {
    render(<TravelPayClaimsDatePicker timeFrame={timeFrame} onTimeFrameChanged={mockOnTimeFrameChanged} />)
  }

  it('renders the picker', () => {
    initializeTestInstance()

    expect(screen.getByTestId('getDateRangeTestID')).toBeTruthy()
    fireEvent.press(screen.getByRole('spinbutton'))
    fireEvent.press(screen.getByRole('button', { name: 'Done' }))
    expect(mockOnTimeFrameChanged).toHaveBeenCalled()
  })

  describe('initializing date picker option from time frame prop', () => {
    it('correctly sets the past 3 months option', async () => {
      initializeTestInstance(TimeFrameTypeConstants.PAST_THREE_MONTHS)
      expect(screen.getByText('Past 3 months')).toBeTruthy()
    })

    it('correctly sets the past 5 to 3 months option', async () => {
      const map = createTimeFrameDateRangeMap()
      const fiveMonthsToThreeMonths = map[TimeFrameTypeConstants.PAST_FIVE_TO_THREE_MONTHS]
      initializeTestInstance(TimeFrameTypeConstants.PAST_FIVE_TO_THREE_MONTHS)

      const pickerText = formatDateRangeMMMyyyy(fiveMonthsToThreeMonths.startDate, fiveMonthsToThreeMonths.endDate)
      expect(screen.getByText(pickerText)).toBeTruthy()
    })

    it('correctly sets the past 8 to 6 months option', async () => {
      const map = createTimeFrameDateRangeMap()
      const eightMonthsToSixMonths = map[TimeFrameTypeConstants.PAST_EIGHT_TO_SIX_MONTHS]
      initializeTestInstance(TimeFrameTypeConstants.PAST_EIGHT_TO_SIX_MONTHS)

      const pickerText = formatDateRangeMMMyyyy(eightMonthsToSixMonths.startDate, eightMonthsToSixMonths.endDate)
      expect(screen.getByText(pickerText)).toBeTruthy()
    })

    it('correctly sets the past 11 to 9 months option', async () => {
      const map = createTimeFrameDateRangeMap()
      const elevenMonthsToNineMonths = map[TimeFrameTypeConstants.PAST_ELEVEN_TO_NINE_MONTHS]
      initializeTestInstance(TimeFrameTypeConstants.PAST_ELEVEN_TO_NINE_MONTHS)

      const pickerText = formatDateRangeMMMyyyy(elevenMonthsToNineMonths.startDate, elevenMonthsToNineMonths.endDate)
      expect(screen.getByText(pickerText)).toBeTruthy()
    })

    it('correctly sets the past all current year option', async () => {
      const currentYear = new Date().getFullYear()
      initializeTestInstance(TimeFrameTypeConstants.PAST_ALL_CURRENT_YEAR)
      expect(screen.getByText(`All of ${currentYear}`)).toBeTruthy()
    })

    it('correctly sets the past all last year option', async () => {
      const currentYear = new Date().getFullYear()
      initializeTestInstance(TimeFrameTypeConstants.PAST_ALL_LAST_YEAR)
      expect(screen.getByText(`All of ${currentYear - 1}`)).toBeTruthy()
    })
  })
})
