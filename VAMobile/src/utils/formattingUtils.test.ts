import { getFormattedTimeForTimeZone } from 'utils/formattingUtils'

describe('formatting utils: getFormattedTimeForTimeZone', () => {
  const originalDate = '2025-05-28T12:00:00.000Z'

  for (const [timeZone, expected] of [
    ['Pacific/Pago_Pago', '1:00 AM ST'],
    ['Pacific/Honolulu', '2:00 AM HST'],
    ['America/Anchorage', '4:00 AM AKDT'],
    ['America/Los_Angeles', '5:00 AM PDT'],
    ['America/Denver', '6:00 AM MDT'],
    ['America/Chicago', '7:00 AM CDT'],
    ['America/New_York', '8:00 AM EDT'],
    ['America/Puerto_Rico', '8:00 AM AST'],
    ['Asia/Manila', '8:00 PM PHT'],
    ['Pacific/Guam', '10:00 PM ChT'],
  ]) {
    it(`should format ${originalDate} in ${timeZone} as ${expected}`, () => {
      const result = getFormattedTimeForTimeZone(originalDate, timeZone)
      expect(result).toBe(expected)
    })
  }
})
