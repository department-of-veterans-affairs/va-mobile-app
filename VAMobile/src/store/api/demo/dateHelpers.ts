import { DateTime } from 'luxon'

export const generateDate = (signSymbol: string, offset: string, units: string): DateTime => {
  const sign = signSymbol === '+' ? 'plus' : 'minus'
  return DateTime.now()[sign]({ [units]: offset })
}

export const getDateFromMock = (mockDateString: string): DateTime => {
  const dateParts = mockDateString.match(/{{now (\+|-) (\d+) (\w+)}}/)
  if (!dateParts) {
    throw new Error('Invalid mock date string format')
  }
  return generateDate(dateParts[1], dateParts[2], dateParts[3])
}
