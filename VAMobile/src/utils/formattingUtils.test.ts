import { TFunction } from 'i18next'
import { DateTime, Settings } from 'luxon'

import commonTranslations from 'translations/en/common.json'
import {
  formatDateMMMyyyy,
  formatDateRangeMMMyyyy,
  getFileUploadTimezoneMessage,
  getFormattedTimeForTimeZone,
} from 'utils/formattingUtils'

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

describe('formatting utils: getFileUploadTimezoneMessage', () => {
  const originalDefaultZone = Settings.defaultZone
  const originalNow = Settings.now

  // Mock translation function using actual translation from common.json
  const mockT = ((key: string, options?: { [key: string]: string }) => {
    if (key === 'fileUpload.timezoneMessage' && options) {
      const template = commonTranslations['fileUpload.timezoneMessage']
      return Object.entries(options).reduce(
        (result, [varName, value]) => result.replace(`{{${varName}}}`, value),
        template,
      )
    }
    return key
  }) as TFunction

  afterEach(() => {
    Settings.defaultZone = originalDefaultZone
    Settings.now = originalNow
  })

  describe('Daylight Saving Time', () => {
    beforeEach(() => {
      // Set fixed date during DST (July 15, 2025 at noon UTC)
      const fixedDate = DateTime.utc(2025, 7, 15, 12)
      Settings.now = () => fixedDate.toMillis()
    })

    describe('west of UTC', () => {
      it('should return complete message for EDT', () => {
        Settings.defaultZone = 'America/New_York'
        const message = getFileUploadTimezoneMessage(mockT)

        expect(message).toBe("If you uploaded files after 8 PM EDT, we'll show them as received on the next day")
      })

      it('should return complete message for PDT', () => {
        Settings.defaultZone = 'America/Los_Angeles'
        const message = getFileUploadTimezoneMessage(mockT)

        expect(message).toBe("If you uploaded files after 5 PM PDT, we'll show them as received on the next day")
      })
    })

    describe('at UTC', () => {
      it('should return empty string for UTC', () => {
        Settings.defaultZone = 'UTC'
        const message = getFileUploadTimezoneMessage(mockT)

        expect(message).toBe('')
      })
    })

    describe('east of UTC', () => {
      it('should return complete message for JST', () => {
        Settings.defaultZone = 'Asia/Tokyo'
        const message = getFileUploadTimezoneMessage(mockT)

        expect(message).toBe("If you uploaded files before 9 AM GMT+9, we'll show them as received on the previous day")
      })

      it('should return complete message for PHT', () => {
        Settings.defaultZone = 'Asia/Manila'
        const message = getFileUploadTimezoneMessage(mockT)

        expect(message).toBe("If you uploaded files before 8 AM PHT, we'll show them as received on the previous day")
      })
    })
  })

  describe('Standard Time', () => {
    beforeEach(() => {
      // Set fixed date during standard time (January 15, 2025 at noon UTC)
      const fixedDate = DateTime.utc(2025, 1, 15, 12)
      Settings.now = () => fixedDate.toMillis()
    })

    describe('west of UTC', () => {
      it('should return complete message for EST', () => {
        Settings.defaultZone = 'America/New_York'
        const message = getFileUploadTimezoneMessage(mockT)

        expect(message).toBe("If you uploaded files after 7 PM EST, we'll show them as received on the next day")
      })

      it('should return complete message for PST', () => {
        Settings.defaultZone = 'America/Los_Angeles'
        const message = getFileUploadTimezoneMessage(mockT)

        expect(message).toBe("If you uploaded files after 4 PM PST, we'll show them as received on the next day")
      })
    })

    describe('at UTC', () => {
      it('should return empty string for UTC', () => {
        Settings.defaultZone = 'UTC'
        const message = getFileUploadTimezoneMessage(mockT)

        expect(message).toBe('')
      })
    })

    describe('east of UTC', () => {
      it('should return complete message for JST', () => {
        Settings.defaultZone = 'Asia/Tokyo'
        const message = getFileUploadTimezoneMessage(mockT)

        expect(message).toBe("If you uploaded files before 9 AM GMT+9, we'll show them as received on the previous day")
      })

      it('should return complete message for PHT', () => {
        Settings.defaultZone = 'Asia/Manila'
        const message = getFileUploadTimezoneMessage(mockT)

        expect(message).toBe("If you uploaded files before 8 AM PHT, we'll show them as received on the previous day")
      })
    })
  })
})

describe('formatting utils: formatDateMMMyyyy', () => {
  it('formats January 15, 2025 as Jan 2025', () => {
    const date = DateTime.fromISO('2025-01-15T12:00:00Z')
    expect(formatDateMMMyyyy(date)).toBe('Jan 2025')
  })

  it('formats December 31, 2024 as Dec 2024', () => {
    const date = DateTime.fromISO('2024-12-31T12:00:00Z')
    expect(formatDateMMMyyyy(date)).toBe('Dec 2024')
  })
})

describe('formatting utils: formatDateRangeMMMyyyy', () => {
  it('formats a Jan 2025 to Feb 2025 range', () => {
    const start = DateTime.fromISO('2025-01-15T12:00:00Z')
    const end = DateTime.fromISO('2025-02-20T12:00:00Z')
    expect(formatDateRangeMMMyyyy(start, end)).toBe('Jan 2025 - Feb 2025')
  })

  it('formats a range within the same month', () => {
    const start = DateTime.fromISO('2025-01-01T12:00:00Z')
    const end = DateTime.fromISO('2025-01-31T12:00:00Z')
    expect(formatDateRangeMMMyyyy(start, end)).toBe('Jan 2025 - Jan 2025')
  })
})
