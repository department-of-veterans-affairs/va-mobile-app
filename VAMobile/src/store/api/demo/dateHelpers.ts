import { DateTime } from 'luxon'

// Generates a DateTime object based on the provided sign, offset, and units
export const generateDate = (signSymbol: string, offset: string, units: string): DateTime => {
  const sign = signSymbol === '+' ? 'plus' : 'minus'
  return DateTime.now()[sign]({ [units]: offset })
}

/**
 * getDateFromMock - Parses a mock date string and returns a DateTime object
 * @param mockDateString - The mock date string to parse
 * @returns DateTime object representing the calculated date
 * Expected format: \{\{now + 5 days\}\} or \{\{now - 2 months\}\}
 * Throws an error if the format is invalid
 */

export const getDateFromMock = (mockDateString: string): DateTime => {
  const dateParts = mockDateString.match(/{{now (\+|-) (\d+) (\w+)}}/)
  if (!dateParts) {
    throw new Error('Invalid mock date string format')
  }
  return generateDate(dateParts[1], dateParts[2], dateParts[3])
}
