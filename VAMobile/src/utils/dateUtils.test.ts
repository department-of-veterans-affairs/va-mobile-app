import { getDateMonthsAgo } from './dateUtils'

describe('formattingUtils', () => {
  describe('getDateMonthsAgo', () => {
    // Use Jest's date mocking functionality
    beforeEach(() => {
      // Set the current date to May 28, 2025 for all tests
      jest.setSystemTime(new Date('2025-05-28T12:00:00.000Z'))
    })

    it('should return date 3 months ago at start of month and start of day', () => {
      const result = getDateMonthsAgo(3, 'start', 'start')

      // Test the full DateTime object properties instead of string formatting
      expect(result.year).toBe(2025)
      expect(result.month).toBe(2) // February
      expect(result.day).toBe(1)
      expect(result.hour).toBe(0)
      expect(result.minute).toBe(0)
      expect(result.second).toBe(0)
    })

    it('should return date 3 months ago at end of month and end of day', () => {
      const result = getDateMonthsAgo(3, 'end', 'end')

      expect(result.year).toBe(2025)
      expect(result.month).toBe(2) // February
      expect(result.day).toBe(28) // Last day of February 2025
      expect(result.hour).toBe(23)
      expect(result.minute).toBe(59)
      expect(result.second).toBe(59)
    })

    it('should return date 6 months ago at start of month and start of day', () => {
      const result = getDateMonthsAgo(6, 'start', 'start')

      expect(result.year).toBe(2024)
      expect(result.month).toBe(11) // November
      expect(result.day).toBe(1)
      expect(result.hour).toBe(0)
      expect(result.minute).toBe(0)
      expect(result.second).toBe(0)
    })

    it('should return date 6 months ago at end of month and end of day', () => {
      const result = getDateMonthsAgo(6, 'end', 'end')

      expect(result.year).toBe(2024)
      expect(result.month).toBe(11) // November
      expect(result.day).toBe(30) // Last day of November
      expect(result.hour).toBe(23)
      expect(result.minute).toBe(59)
      expect(result.second).toBe(59)
    })

    it('should return date 12 months ago at start of month and start of day', () => {
      const result = getDateMonthsAgo(12, 'start', 'start')

      expect(result.year).toBe(2024)
      expect(result.month).toBe(5) // May
      expect(result.day).toBe(1)
      expect(result.hour).toBe(0)
      expect(result.minute).toBe(0)
      expect(result.second).toBe(0)
    })

    it('should return date 12 months ago at end of month and end of day', () => {
      const result = getDateMonthsAgo(12, 'end', 'end')

      expect(result.year).toBe(2024)
      expect(result.month).toBe(5) // May
      expect(result.day).toBe(31) // Last day of May
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
})
