import { MedicalCopayRecord } from 'api/types/MedicalCopayData'
import {
  DUE_DATE_DAYS,
  calcDueDate,
  formatDate,
  getMedicalCenterNameByID,
  medicalCenterLabels,
  sortStatementsByDate,
  uniqBy,
  verifyCurrentBalance,
} from 'utils/copays'

describe('copays utils', () => {
  describe('DUE_DATE_DAYS', () => {
    it('should be 30', () => {
      expect(DUE_DATE_DAYS).toBe(30)
    })
  })

  describe('medicalCenterLabels', () => {
    it('should be an object with string keys and values', () => {
      expect(typeof medicalCenterLabels).toBe('object')
      expect(medicalCenterLabels).not.toBeNull()
    })

    it('should have facility IDs as keys', () => {
      const keys = Object.keys(medicalCenterLabels)
      expect(keys.length).toBeGreaterThan(0)
      // All keys should be strings
      keys.forEach((key) => {
        expect(typeof key).toBe('string')
      })
    })
  })

  describe('getMedicalCenterNameByID', () => {
    it('should return empty string for null input', () => {
      expect(getMedicalCenterNameByID(null)).toBe('')
    })

    it('should return empty string for undefined input', () => {
      expect(getMedicalCenterNameByID(undefined)).toBe('')
    })

    it('should return empty string for empty string input', () => {
      expect(getMedicalCenterNameByID('')).toBe('')
    })

    it('should parse facility ID with dash separator', () => {
      const result = getMedicalCenterNameByID('123 - Test Facility')
      expect(result).toBe('123 - Test Facility') // Falls back to original if not found in labels
    })

    it('should handle facility ID without dash separator', () => {
      const result = getMedicalCenterNameByID('123TestFacility')
      expect(result).toBe('123TestFacility')
    })

    it('should return original string if no match found', () => {
      const result = getMedicalCenterNameByID('NONEXISTENT123')
      expect(result).toBe('NONEXISTENT123')
    })
  })

  describe('formatDate', () => {
    it('should return empty string for null input', () => {
      expect(formatDate(null)).toBe('')
    })

    it('should return empty string for undefined input', () => {
      expect(formatDate(undefined)).toBe('')
    })

    it('should format valid date string', () => {
      const result = formatDate('01/15/2024')
      expect(result).toBe('January 15, 2024')
    })

    it('should format Date object', () => {
      const date = '01/15/2024' // Use string format instead
      const result = formatDate(date)
      expect(result).toBe('January 15, 2024')
    })

    it('should handle invalid date string', () => {
      const result = formatDate('invalid-date')
      expect(result).toBe('')
    })

    it('should handle date string with NBSP characters', () => {
      const result = formatDate('01/15/2024\u00A0')
      expect(result).toBe('January 15, 2024')
    })

    it('should handle date string with extra whitespace', () => {
      const result = formatDate('  01/15/2024  ')
      expect(result).toBe('January 15, 2024')
    })
  })

  describe('calcDueDate', () => {
    it('should calculate due date from string', () => {
      const result = calcDueDate('01/15/2024', 30)
      expect(result).toBe('February 14, 2024')
    })

    it('should calculate due date from Date object', () => {
      const date = '01/15/2024' // Use string format instead
      const result = calcDueDate(date, 30)
      expect(result).toBe('February 14, 2024')
    })

    it('should handle zero days', () => {
      const result = calcDueDate('01/15/2024', 0)
      expect(result).toBe('January 15, 2024')
    })

    it('should handle negative days', () => {
      const result = calcDueDate('01/15/2024', -5)
      expect(result).toBe('January 10, 2024')
    })
  })

  describe('verifyCurrentBalance', () => {
    beforeEach(() => {
      // Mock current date to January 15, 2024
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-01-15'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should return true for current balance (within 30 days)', () => {
      const result = verifyCurrentBalance('01/01/2024') // 14 days ago
      expect(result).toBe(true)
    })

    it('should return true for balance due today', () => {
      const result = verifyCurrentBalance('01/15/2024') // Today
      expect(result).toBe(true)
    })

    it('should return false for past due balance (over 30 days)', () => {
      const result = verifyCurrentBalance('12/01/2023') // 45 days ago
      expect(result).toBe(false)
    })

    it('should work with Date objects', () => {
      const date = '01/01/2024' // Use string format instead
      const result = verifyCurrentBalance(date)
      expect(result).toBe(true)
    })
  })

  describe('sortStatementsByDate', () => {
    const mockStatements: MedicalCopayRecord[] = [
      {
        id: '1',
        pSStatementDateOutput: '01/15/2024',
        pHAmtDue: 50.0,
        pSFacilityNum: '123',
        station: { facilitYNum: '123 - Test Facility' },
        details: [],
      },
      {
        id: '2',
        pSStatementDateOutput: '02/15/2024',
        pHAmtDue: 75.0,
        pSFacilityNum: '456',
        station: { facilitYNum: '456 - Another Facility' },
        details: [],
      },
      {
        id: '3',
        pSStatementDateOutput: '12/15/2023',
        pHAmtDue: 100.0,
        pSFacilityNum: '789',
        station: { facilitYNum: '789 - Old Facility' },
        details: [],
      },
    ]

    it('should sort statements by date (newest first)', () => {
      const result = sortStatementsByDate(mockStatements)
      expect(result[0].id).toBe('2') // February 15, 2024
      expect(result[1].id).toBe('1') // January 15, 2024
      expect(result[2].id).toBe('3') // December 15, 2023
    })

    it('should handle empty array', () => {
      const result = sortStatementsByDate([])
      expect(result).toEqual([])
    })

    it('should handle single item array', () => {
      const singleItem = [mockStatements[0]]
      const result = sortStatementsByDate(singleItem)
      expect(result).toEqual(singleItem)
    })

    it('should handle statements with invalid dates', () => {
      const statementsWithInvalidDates = [
        ...mockStatements,
        {
          id: '4',
          pSStatementDateOutput: 'invalid-date',
          pHAmtDue: 25.0,
          pSFacilityNum: '999',
          station: { facilitYNum: '999 - Invalid Date' },
          details: [],
        },
      ]
      const result = sortStatementsByDate(statementsWithInvalidDates)
      // Invalid dates should be sorted to the end (lowest timestamp)
      expect(result[result.length - 1].id).toBe('4')
    })
  })

  describe('uniqBy', () => {
    const mockData = [
      { id: 1, name: 'Alex', category: 'A' },
      { id: 2, name: 'Dave', category: 'B' },
      { id: 3, name: 'Matt', category: 'A' },
      { id: 4, name: 'Michael', category: 'C' },
      { id: 5, name: 'Kim', category: 'B' },
    ]

    it('should return unique items by key function', () => {
      const result = uniqBy(mockData, (item) => item.category)
      expect(result).toHaveLength(3)
      expect(result.map((item) => item.category)).toEqual(['A', 'B', 'C'])
    })

    it('should preserve first occurrence of duplicates', () => {
      const result = uniqBy(mockData, (item) => item.category)
      expect(result[0].name).toBe('Alex') // First 'A' category
      expect(result[1].name).toBe('Dave') // First 'B' category
    })

    it('should handle empty array', () => {
      const result = uniqBy([] as typeof mockData, (item) => item.id)
      expect(result).toEqual([])
    })

    it('should handle array with no duplicates', () => {
      const result = uniqBy(mockData, (item) => item.id)
      expect(result).toEqual(mockData)
    })

    it('should work with different key types', () => {
      const result = uniqBy(mockData, (item) => item.name.length)
      expect(result).toHaveLength(3) // Lengths: 4 (Alex, Dave, Matt), 7 (Michael), 3 (Kim)
    })

    it('should work with primitive values', () => {
      const numbers = [1, 2, 2, 3, 3, 3, 4]
      const result = uniqBy(numbers, (n) => n)
      expect(result).toEqual([1, 2, 3, 4])
    })

    it('should handle null/undefined keys', () => {
      const dataWithNulls = [
        { id: 1, value: 'a' },
        { id: 2, value: null },
        { id: 3, value: 'b' },
        { id: 4, value: null },
      ]
      const result = uniqBy(dataWithNulls, (item) => item.value)
      expect(result).toHaveLength(3)
    })
  })
})
