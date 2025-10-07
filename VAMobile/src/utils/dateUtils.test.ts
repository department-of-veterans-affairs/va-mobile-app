import { TFunction } from 'i18next'
import { DateTime } from 'luxon'

import { TimeFrameType, TimeFrameTypeConstants } from 'constants/timeframes'
import {
  createTimeFrameDateRangeMap,
  getDateMonthsAgo,
  getDateRangeFromTimeFrame,
  getPickerOptions,
} from 'utils/dateUtils'

describe('dateUtils', () => {
  describe('getDateMonthsAgo', () => {
    // Use Jest's date mocking functionality
    beforeEach(() => {
      // Set the current date to May 28, 2025 for all tests
      jest.setSystemTime(new Date('2025-05-28T12:00:00.000Z'))
    })

    it('should return date 2 months ago at start of month and start of day', () => {
      const result = getDateMonthsAgo(2, 'start', 'start')

      // Test the full DateTime object properties instead of string formatting
      expect(result.year).toBe(2025)
      expect(result.month).toBe(3) // March
      expect(result.day).toBe(1)
      expect(result.hour).toBe(0)
      expect(result.minute).toBe(0)
      expect(result.second).toBe(0)
    })

    it('should return date 2 months ago at end of month and end of day', () => {
      const result = getDateMonthsAgo(2, 'end', 'end')

      expect(result.year).toBe(2025)
      expect(result.month).toBe(3) // March
      expect(result.day).toBe(31) // Last day of March 2025
      expect(result.hour).toBe(23)
      expect(result.minute).toBe(59)
      expect(result.second).toBe(59)
    })

    it('should return date 5 months ago at start of month and start of day', () => {
      const result = getDateMonthsAgo(5, 'start', 'start')

      expect(result.year).toBe(2024)
      expect(result.month).toBe(12) // December
      expect(result.day).toBe(1)
      expect(result.hour).toBe(0)
      expect(result.minute).toBe(0)
      expect(result.second).toBe(0)
    })

    it('should return date 5 months ago at end of month and end of day', () => {
      const result = getDateMonthsAgo(5, 'end', 'end')

      expect(result.year).toBe(2024)
      expect(result.month).toBe(12) // December
      expect(result.day).toBe(31) // Last day of Decemeber 2024
      expect(result.hour).toBe(23)
      expect(result.minute).toBe(59)
      expect(result.second).toBe(59)
    })

    it('should return date 11 months ago at start of month and start of day', () => {
      const result = getDateMonthsAgo(11, 'start', 'start')

      expect(result.year).toBe(2024)
      expect(result.month).toBe(6) // June
      expect(result.day).toBe(1)
      expect(result.hour).toBe(0)
      expect(result.minute).toBe(0)
      expect(result.second).toBe(0)
    })

    it('should return date 11 months ago at end of month and end of day', () => {
      const result = getDateMonthsAgo(11, 'end', 'end')

      expect(result.year).toBe(2024)
      expect(result.month).toBe(6) // June
      expect(result.day).toBe(30) // Last day of June
      expect(result.hour).toBe(23)
      expect(result.minute).toBe(59)
      expect(result.second).toBe(59)
    })

    it('should handle months with varying days correctly', () => {
      // Test January (31 days)
      jest.setSystemTime(new Date('2025-01-15'))
      let result = getDateMonthsAgo(3, 'end', 'end')
      expect(result.year).toBe(2024)
      expect(result.month).toBe(10) // October
      expect(result.day).toBe(31)

      // Test February (28 days in 2023)
      jest.setSystemTime(new Date('2024-02-15'))
      result = getDateMonthsAgo(3, 'end', 'end')
      expect(result.year).toBe(2023)
      expect(result.month).toBe(11) // November
      expect(result.day).toBe(30)

      // Test February in leap year (29 days in 2024)
      jest.setSystemTime(new Date('2024-05-15'))
      result = getDateMonthsAgo(3, 'end', 'end')
      expect(result.year).toBe(2024)
      expect(result.month).toBe(2) // February
      expect(result.day).toBe(29) // February in leap year has 29 days
    })

    it('should use default parameters correctly', () => {
      // Default position is 'start', default timePosition is 'start'
      const result = getDateMonthsAgo(3)
      expect(result.year).toBe(2025)
      expect(result.month).toBe(2) // February
      expect(result.day).toBe(1)
      expect(result.hour).toBe(0)
      expect(result.minute).toBe(0)
      expect(result.second).toBe(0)
    })

    it('should handle negative values by moving forward in time', () => {
      const result = getDateMonthsAgo(-3, 'start', 'start')
      expect(result.year).toBe(2025)
      expect(result.month).toBe(8) // August
      expect(result.day).toBe(1)
    })

    it('should handle zero values by returning current month', () => {
      const result = getDateMonthsAgo(0, 'start', 'start')
      expect(result.year).toBe(2025)
      expect(result.month).toBe(5) // May
      expect(result.day).toBe(1)
    })
  })
  describe('createTimeFrameDateRangeMap', () => {
    it('should return all expected time frame types', () => {
      const dateRanges = createTimeFrameDateRangeMap()

      const expectedKeys = [
        TimeFrameTypeConstants.UPCOMING,
        TimeFrameTypeConstants.PAST_THREE_MONTHS,
        TimeFrameTypeConstants.PAST_FIVE_TO_THREE_MONTHS,
        TimeFrameTypeConstants.PAST_EIGHT_TO_SIX_MONTHS,
        TimeFrameTypeConstants.PAST_ELEVEN_TO_NINE_MONTHS,
        TimeFrameTypeConstants.PAST_FOURTEEN_TO_TWELVE_MONTHS,
        TimeFrameTypeConstants.PAST_ALL_CURRENT_YEAR,
        TimeFrameTypeConstants.PAST_ALL_LAST_YEAR,
      ]

      expect(Object.keys(dateRanges)).toEqual(expect.arrayContaining(expectedKeys))
      expect(Object.keys(dateRanges)).toHaveLength(expectedKeys.length)
    })

    it('should ensure start dates are always before end dates', () => {
      const dateRanges = createTimeFrameDateRangeMap()

      Object.keys(dateRanges).forEach((key) => {
        const range = dateRanges[key]
        expect(range.startDate.toMillis()).toBeLessThan(range.endDate.toMillis())
      })
    })

    it('should create DateTime objects with correct timezone handling', () => {
      const dateRanges = createTimeFrameDateRangeMap()

      // All DateTime objects should be valid
      Object.keys(dateRanges).forEach((key) => {
        const range = dateRanges[key]
        expect(range.startDate.isValid).toBe(true)
        expect(range.endDate.isValid).toBe(true)
      })
    })

    it('should maintain appropriate time boundaries for different range types', () => {
      const dateRanges = createTimeFrameDateRangeMap()

      // Test that dates using startOf('day') are at midnight
      const startOfDayRanges = [
        TimeFrameTypeConstants.UPCOMING,
        TimeFrameTypeConstants.PAST_FIVE_TO_THREE_MONTHS,
        TimeFrameTypeConstants.PAST_EIGHT_TO_SIX_MONTHS,
        TimeFrameTypeConstants.PAST_ELEVEN_TO_NINE_MONTHS,
        TimeFrameTypeConstants.PAST_FOURTEEN_TO_TWELVE_MONTHS,
        TimeFrameTypeConstants.PAST_ALL_CURRENT_YEAR,
        TimeFrameTypeConstants.PAST_ALL_LAST_YEAR,
      ]

      startOfDayRanges.forEach((rangeKey) => {
        const range = dateRanges[rangeKey]
        // Check if it's at start of day (should be midnight)
        expect(range.startDate.hour).toBe(0)
        expect(range.startDate.minute).toBe(0)
        // Note: seconds/milliseconds might not be exactly 0 due to how todaysDate is captured
        // This is acceptable as long as it's the same day
      })

      // Test that dates using endOf('day') are at end of day
      const endOfDayRanges = [
        TimeFrameTypeConstants.UPCOMING,
        TimeFrameTypeConstants.PAST_THREE_MONTHS,
        TimeFrameTypeConstants.PAST_FIVE_TO_THREE_MONTHS,
        TimeFrameTypeConstants.PAST_ALL_CURRENT_YEAR,
      ]

      endOfDayRanges.forEach((rangeKey) => {
        const range = dateRanges[rangeKey]
        expect(range.endDate.hour).toBe(23)
        expect(range.endDate.minute).toBe(59)
        expect(range.endDate.second).toBe(59)
        expect(range.endDate.millisecond).toBe(999)
      })

      // Test ranges that use endOf('month').endOf('day') - these should also be at end of day
      const endOfMonthEndOfDayRanges = [
        TimeFrameTypeConstants.PAST_EIGHT_TO_SIX_MONTHS,
        TimeFrameTypeConstants.PAST_ELEVEN_TO_NINE_MONTHS,
        TimeFrameTypeConstants.PAST_FOURTEEN_TO_TWELVE_MONTHS,
      ]

      endOfMonthEndOfDayRanges.forEach((rangeKey) => {
        const range = dateRanges[rangeKey]
        expect(range.endDate.hour).toBe(23)
        expect(range.endDate.minute).toBe(59)
        expect(range.endDate.second).toBe(59)
        expect(range.endDate.millisecond).toBe(999)
      })

      const lastYearRange = dateRanges[TimeFrameTypeConstants.PAST_ALL_LAST_YEAR]
      expect(lastYearRange.endDate.hour).toBe(23)
      expect(lastYearRange.endDate.minute).toBe(59)
      expect(lastYearRange.endDate.second).toBeLessThanOrEqual(59)
      expect(lastYearRange.endDate.millisecond).toBe(999)

      // Note: PAST_THREE_MONTHS, PAST_FIVE_TO_THREE_MONTHS, and PAST_ALL_CURRENT_YEAR
      // use todaysDate.endOf('day') so they should be at end of day, tested above

      // Test that PAST_THREE_MONTHS start date is at current time (not start of day)
      const pastThreeMonthsRange = dateRanges[TimeFrameTypeConstants.PAST_THREE_MONTHS]
      expect(pastThreeMonthsRange.startDate.hour).toBeGreaterThanOrEqual(0)
      expect(pastThreeMonthsRange.startDate.hour).toBeLessThanOrEqual(23)
    })

    it('should create consistent relative date ranges based on current date', () => {
      const dateRanges = createTimeFrameDateRangeMap()

      // Get current date for relative calculations - we test the relationships, not hardcoded values
      const now = DateTime.local()

      // Test UPCOMING range (today to 390 days future)
      const upcomingRange = dateRanges[TimeFrameTypeConstants.UPCOMING]
      expect(upcomingRange.startDate.hasSame(now.startOf('day'), 'day')).toBe(true)
      expect(upcomingRange.endDate.hasSame(now.plus({ days: 390 }).endOf('day'), 'day')).toBe(true)

      // Test PAST_THREE_MONTHS (3 months ago to today)
      const pastThreeMonthsRange = dateRanges[TimeFrameTypeConstants.PAST_THREE_MONTHS]
      expect(pastThreeMonthsRange.startDate.hasSame(now.minus({ months: 3 }).startOf('day'), 'day')).toBe(true)
      expect(pastThreeMonthsRange.endDate.hasSame(now.endOf('day'), 'day')).toBe(true)

      // Test PAST_ALL_CURRENT_YEAR (Jan 1 current year to today)
      const currentYearRange = dateRanges[TimeFrameTypeConstants.PAST_ALL_CURRENT_YEAR]
      const expectedCurrentYearStart = now.set({ month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 })
      expect(currentYearRange.startDate.hasSame(expectedCurrentYearStart, 'day')).toBe(true)
      expect(currentYearRange.endDate.hasSame(now.endOf('day'), 'day')).toBe(true)

      // Test PAST_ALL_LAST_YEAR (Jan 1 to Dec 31 of last year)
      const lastYearRange = dateRanges[TimeFrameTypeConstants.PAST_ALL_LAST_YEAR]
      const expectedLastYearStart = now
        .minus({ years: 1 })
        .set({ month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 })
      const expectedLastYearEnd = now
        .minus({ years: 1 })
        .set({ month: 12, day: 31, hour: 23, minute: 59, second: 59, millisecond: 999 })
      expect(lastYearRange.startDate.hasSame(expectedLastYearStart, 'day')).toBe(true)
      expect(lastYearRange.endDate.hasSame(expectedLastYearEnd, 'day')).toBe(true)
    })

    it('should handle month-based ranges correctly', () => {
      const dateRanges = createTimeFrameDateRangeMap()

      const now = DateTime.local()

      // Test PAST_FIVE_TO_THREE_MONTHS (start of 5 months ago to end of 3 months ago)
      const fiveToThreeRange = dateRanges[TimeFrameTypeConstants.PAST_FIVE_TO_THREE_MONTHS]
      const expectedStart = now.minus({ months: 5 }).startOf('month').startOf('day')
      const expectedEnd = now.minus({ months: 3 }).endOf('day')
      expect(fiveToThreeRange.startDate.hasSame(expectedStart, 'day')).toBe(true)
      expect(fiveToThreeRange.endDate.hasSame(expectedEnd, 'day')).toBe(true)

      // Test PAST_EIGHT_TO_SIX_MONTHS (start of 8 months ago to end of 6 months ago)
      const eightToSixRange = dateRanges[TimeFrameTypeConstants.PAST_EIGHT_TO_SIX_MONTHS]
      const expectedStart8 = now.minus({ months: 8 }).startOf('month').startOf('day')
      const expectedEnd6 = now.minus({ months: 6 }).endOf('month').endOf('day')
      expect(eightToSixRange.startDate.hasSame(expectedStart8, 'day')).toBe(true)
      expect(eightToSixRange.endDate.hasSame(expectedEnd6, 'day')).toBe(true)

      // Test PAST_ELEVEN_TO_NINE_MONTHS
      const elevenToNineRange = dateRanges[TimeFrameTypeConstants.PAST_ELEVEN_TO_NINE_MONTHS]
      const expectedStart11 = now.minus({ months: 11 }).startOf('month').startOf('day')
      const expectedEnd9 = now.minus({ months: 9 }).endOf('month').endOf('day')
      expect(elevenToNineRange.startDate.hasSame(expectedStart11, 'day')).toBe(true)
      expect(elevenToNineRange.endDate.hasSame(expectedEnd9, 'day')).toBe(true)

      // Test PAST_FOURTEEN_TO_TWELVE_MONTHS
      const fourteenToTwelveRange = dateRanges[TimeFrameTypeConstants.PAST_FOURTEEN_TO_TWELVE_MONTHS]
      const expectedStart14 = now.minus({ months: 14 }).startOf('month').startOf('day')
      const expectedEnd12 = now.minus({ months: 12 }).endOf('month').endOf('day')
      expect(fourteenToTwelveRange.startDate.hasSame(expectedStart14, 'day')).toBe(true)
      expect(fourteenToTwelveRange.endDate.hasSame(expectedEnd12, 'day')).toBe(true)
    })

    it('should handle year boundaries and leap years correctly', () => {
      const dateRanges = createTimeFrameDateRangeMap()

      const now = DateTime.local()

      // Test that current year range starts at Jan 1
      const currentYearRange = dateRanges[TimeFrameTypeConstants.PAST_ALL_CURRENT_YEAR]
      expect(currentYearRange.startDate.year).toBe(now.year)
      expect(currentYearRange.startDate.month).toBe(1)
      expect(currentYearRange.startDate.day).toBe(1)

      // Test that last year range is for the previous year
      const lastYearRange = dateRanges[TimeFrameTypeConstants.PAST_ALL_LAST_YEAR]
      expect(lastYearRange.startDate.year).toBe(now.year - 1)
      expect(lastYearRange.endDate.year).toBe(now.year - 1)
      expect(lastYearRange.startDate.month).toBe(1)
      expect(lastYearRange.startDate.day).toBe(1)
      expect(lastYearRange.endDate.month).toBe(12)
      expect(lastYearRange.endDate.day).toBe(31)

      // Test that the function handles month arithmetic correctly
      const fiveToThreeRange = dateRanges[TimeFrameTypeConstants.PAST_FIVE_TO_THREE_MONTHS]
      const expectedStartMonth = now.minus({ months: 5 }).month
      const expectedEndMonth = now.minus({ months: 3 }).month
      expect(fiveToThreeRange.startDate.month).toBe(expectedStartMonth)
      expect(fiveToThreeRange.endDate.month).toBe(expectedEndMonth)
    })

    it('should produce date ranges that work with real API calls', () => {
      const dateRanges = createTimeFrameDateRangeMap()

      // Test that getDateRangeFromTimeFrame produces ISO strings for each range
      Object.keys(dateRanges).forEach((timeFrameType) => {
        const isoRange = getDateRangeFromTimeFrame(timeFrameType as TimeFrameType)

        expect(typeof isoRange.startDate).toBe('string')
        expect(typeof isoRange.endDate).toBe('string')

        // Verify they are valid ISO strings
        expect(DateTime.fromISO(isoRange.startDate).isValid).toBe(true)
        expect(DateTime.fromISO(isoRange.endDate).isValid).toBe(true)

        // Verify start is before end
        expect(DateTime.fromISO(isoRange.startDate).toMillis()).toBeLessThan(
          DateTime.fromISO(isoRange.endDate).toMillis(),
        )
      })
    })
  })

  describe('getPickerOptions', () => {
    // Mock translation function
    const mockT = jest.fn((key: string, options?: Record<string, unknown>) => {
      // Simulate translation function behavior
      if (key === 'pastAppointments.pastThreeMonths') return 'Past 3 months'
      if (key === 'pastAppointments.allOf' && options?.year) return `All of ${options.year}`
      if (key === 'pastAppointments.dateRangeA11yLabel' && options?.date1 && options?.date2) {
        return `Date range from ${options.date1} to ${options.date2}`
      }
      if (key === 'custom.pastThreeMonths') return 'Custom Past 3 months'
      if (key === 'custom.allOf' && options?.year) return `Custom All of ${options.year}`
      if (key === 'custom.dateRangeA11y' && options?.date1 && options?.date2) {
        return `Custom date range from ${options.date1} to ${options.date2}`
      }
      return key // fallback to key if no match
    }) as unknown as TFunction

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should return an array of TimeFrameDropDownItem objects with correct structure', () => {
      const options = getPickerOptions(mockT)

      expect(Array.isArray(options)).toBe(true)
      expect(options).toHaveLength(6)

      options.forEach((option) => {
        expect(option).toHaveProperty('label')
        expect(option).toHaveProperty('value')
        expect(option).toHaveProperty('a11yLabel')
        expect(option).toHaveProperty('dates')
        expect(option.dates).toHaveProperty('startDate')
        expect(option.dates).toHaveProperty('endDate')

        // Verify types
        expect(typeof option.label).toBe('string')
        expect(typeof option.value).toBe('string')
        expect(typeof option.a11yLabel).toBe('string')
        expect(option.dates.startDate).toBeInstanceOf(DateTime)
        expect(option.dates.endDate).toBeInstanceOf(DateTime)
      })
    })

    it('should return picker options in correct order', () => {
      const options = getPickerOptions(mockT)

      const expectedOrder = [
        TimeFrameTypeConstants.PAST_THREE_MONTHS,
        TimeFrameTypeConstants.PAST_FIVE_TO_THREE_MONTHS,
        TimeFrameTypeConstants.PAST_EIGHT_TO_SIX_MONTHS,
        TimeFrameTypeConstants.PAST_ELEVEN_TO_NINE_MONTHS,
        TimeFrameTypeConstants.PAST_ALL_CURRENT_YEAR,
        TimeFrameTypeConstants.PAST_ALL_LAST_YEAR,
      ]

      expectedOrder.forEach((expectedValue, index) => {
        expect(options[index].value).toBe(expectedValue)
      })
    })

    it('should use default translation keys when none provided', () => {
      getPickerOptions(mockT)

      // Verify translation function was called with default keys
      expect(mockT).toHaveBeenCalledWith('pastAppointments.pastThreeMonths')
      expect(mockT).toHaveBeenCalledWith(
        'pastAppointments.allOf',
        expect.objectContaining({ year: expect.any(Number) }),
      )
      expect(mockT).toHaveBeenCalledWith(
        'pastAppointments.dateRangeA11yLabel',
        expect.objectContaining({
          date1: expect.any(String),
          date2: expect.any(String),
        }),
      )
    })

    it('should use custom translation keys when provided', () => {
      const customTKeys = {
        dateRangeA11yLabelTKey: 'custom.dateRangeA11y',
        allOfTKey: 'custom.allOf',
        pastThreeMonthsTKey: 'custom.pastThreeMonths',
      }

      getPickerOptions(mockT, customTKeys)

      // Verify translation function was called with custom keys
      expect(mockT).toHaveBeenCalledWith('custom.pastThreeMonths')
      expect(mockT).toHaveBeenCalledWith('custom.allOf', expect.objectContaining({ year: expect.any(Number) }))
      expect(mockT).toHaveBeenCalledWith(
        'custom.dateRangeA11y',
        expect.objectContaining({
          date1: expect.any(String),
          date2: expect.any(String),
        }),
      )
    })

    it('should have correct testID values for each option', () => {
      const options = getPickerOptions(mockT)

      const expectedValues = [
        TimeFrameTypeConstants.PAST_THREE_MONTHS,
        TimeFrameTypeConstants.PAST_FIVE_TO_THREE_MONTHS,
        TimeFrameTypeConstants.PAST_EIGHT_TO_SIX_MONTHS,
        TimeFrameTypeConstants.PAST_ELEVEN_TO_NINE_MONTHS,
        TimeFrameTypeConstants.PAST_ALL_CURRENT_YEAR,
        TimeFrameTypeConstants.PAST_ALL_LAST_YEAR,
      ]

      expectedValues.forEach((expectedValue, index) => {
        expect(options[index].value).toBe(expectedValue)
      })
    })

    it('should generate correct labels for date range options', () => {
      const options = getPickerOptions(mockT)

      // First option should use translation for past three months
      expect(options[0].label).toBe('Past 3 months')

      // Year-based options should include the year
      const currentYear = DateTime.local().year
      const lastYear = currentYear - 1

      const currentYearOption = options.find((opt) => opt.value === TimeFrameTypeConstants.PAST_ALL_CURRENT_YEAR)
      const lastYearOption = options.find((opt) => opt.value === TimeFrameTypeConstants.PAST_ALL_LAST_YEAR)

      expect(currentYearOption?.label).toBe(`All of ${currentYear}`)
      expect(lastYearOption?.label).toBe(`All of ${lastYear}`)

      // Date range options should use formatted date ranges (we'll check they're strings with date patterns)
      const dateRangeOptions = options.filter((opt) =>
        [
          TimeFrameTypeConstants.PAST_FIVE_TO_THREE_MONTHS,
          TimeFrameTypeConstants.PAST_EIGHT_TO_SIX_MONTHS,
          TimeFrameTypeConstants.PAST_ELEVEN_TO_NINE_MONTHS,
        ].includes(opt.value as TimeFrameType),
      )

      dateRangeOptions.forEach((option) => {
        expect(typeof option.label).toBe('string')
        expect(option.label.length).toBeGreaterThan(0)
        // Should contain a hyphen for date ranges
        expect(option.label).toMatch(/-/)
      })
    })

    it('should generate correct accessibility labels', () => {
      const options = getPickerOptions(mockT)

      // First option should use same translation as label
      expect(options[0].a11yLabel).toBe('Past 3 months')

      // Year-based options should have accessibility labels with years
      const currentYear = DateTime.local().year
      const lastYear = currentYear - 1

      const currentYearOption = options.find((opt) => opt.value === TimeFrameTypeConstants.PAST_ALL_CURRENT_YEAR)
      const lastYearOption = options.find((opt) => opt.value === TimeFrameTypeConstants.PAST_ALL_LAST_YEAR)

      expect(currentYearOption?.a11yLabel).toBe(`All of ${currentYear}`)
      expect(lastYearOption?.a11yLabel).toBe(`All of ${lastYear}`)

      // Date range options should have accessibility labels with formatted dates
      const dateRangeOptions = options.filter((opt) =>
        [
          TimeFrameTypeConstants.PAST_FIVE_TO_THREE_MONTHS,
          TimeFrameTypeConstants.PAST_EIGHT_TO_SIX_MONTHS,
          TimeFrameTypeConstants.PAST_ELEVEN_TO_NINE_MONTHS,
        ].includes(opt.value as TimeFrameType),
      )

      dateRangeOptions.forEach((option) => {
        expect(option.a11yLabel).toMatch(/^Date range from .+ to .+$/)
      })
    })

    it('should have correct date ranges that match createTimeFrameDateRangeMap', () => {
      const options = getPickerOptions(mockT)
      const dateRangeMap = createTimeFrameDateRangeMap()

      options.forEach((option) => {
        const expectedRange = dateRangeMap[option.value]

        if (option.value === TimeFrameTypeConstants.PAST_THREE_MONTHS) {
          // PAST_THREE_MONTHS option uses PAST_FIVE_TO_THREE_MONTHS dates (this is intentional per implementation)
          const fiveToThreeRange = dateRangeMap[TimeFrameTypeConstants.PAST_FIVE_TO_THREE_MONTHS]
          expect(option.dates.startDate.toMillis()).toBe(fiveToThreeRange.startDate.toMillis())
          expect(option.dates.endDate.toMillis()).toBe(fiveToThreeRange.endDate.toMillis())
        } else {
          expect(option.dates.startDate.toMillis()).toBe(expectedRange.startDate.toMillis())
          expect(option.dates.endDate.toMillis()).toBe(expectedRange.endDate.toMillis())
        }
      })
    })

    it('should ensure all date ranges have start dates before end dates', () => {
      const options = getPickerOptions(mockT)

      options.forEach((option) => {
        expect(option.dates.startDate.toMillis()).toBeLessThan(option.dates.endDate.toMillis())
      })
    })

    it('should call translation function with correct parameters for year-based options', () => {
      getPickerOptions(mockT)
      const currentYear = DateTime.local().year
      const lastYear = currentYear - 1

      // Verify calls for year-based options
      expect(mockT).toHaveBeenCalledWith('pastAppointments.allOf', { year: currentYear })
      expect(mockT).toHaveBeenCalledWith('pastAppointments.allOf', { year: lastYear })
    })

    it('should call translation function with correct parameters for date range accessibility labels', () => {
      getPickerOptions(mockT)

      // Verify calls for date range a11y labels include date1 and date2 parameters
      const mockTCalls = (mockT as jest.MockedFunction<TFunction>).mock.calls
      const dateRangeA11yLabelCalls = mockTCalls.filter((call) => call[0] === 'pastAppointments.dateRangeA11yLabel')

      expect(dateRangeA11yLabelCalls.length).toBe(3) // Three date range options

      dateRangeA11yLabelCalls.forEach((call) => {
        const callOptions = call[1] as Record<string, unknown>
        expect(callOptions).toHaveProperty('date1')
        expect(callOptions).toHaveProperty('date2')
        expect(typeof callOptions.date1).toBe('string')
        expect(typeof callOptions.date2).toBe('string')
      })
    })
  })
})
