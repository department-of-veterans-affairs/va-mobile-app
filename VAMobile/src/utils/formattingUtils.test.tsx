import { Settings } from 'luxon'
import { context } from 'testUtils'
import { getFormattedDateTimeYear } from 'utils/formattingUtils'

context('format utilities', () => {
  Settings.defaultZone = 'utc'
  let exampleDateTimes = {
    am: '2022-01-06T06:13:27Z',
    pm: '2022-01-06T22:13:27Z',
    invalid: '2022-01-22:13:27Z',
  }

  describe('format date time and year', () => {
    it('should get the right DateTime from ISO', async () => {
      expect(getFormattedDateTimeYear(exampleDateTimes.am)).toBe('January 6, 2022, 6:13 a.m.')
      expect(getFormattedDateTimeYear(exampleDateTimes.pm)).toBe('January 6, 2022, 10:13 p.m.')
    })

    it('should show invalid when ISO incorrect', async () => {
      expect(getFormattedDateTimeYear(exampleDateTimes.invalid)).toBe('Invalid DateTime')
    })
  })
})
