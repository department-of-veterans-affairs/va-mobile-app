import { Settings, DateTime } from 'luxon'
import { context } from 'testUtils'
import { getFormattedMessageTime } from 'utils/formattingUtils'

context('format utilities', () => {
  const expectNow = DateTime.local(2022, 1, 20, 12)
  Settings.now = () => expectNow.toMillis()
  Settings.defaultZone = 'utc'

  let exampleDateTimes = {
    new: '2022-01-20T06:13:27Z',
    old: '2022-01-19T06:13:27Z',
    invalid: '2022-01-22:13:27Z',
  }

  describe('format date time and year', () => {
    it('should get the time if within 24 hrs', async () => {
      expect(getFormattedMessageTime(exampleDateTimes.new)).toBe('6:13 AM')
    })

    it('should get the date if older than 24 hrs', async () => {
      expect(getFormattedMessageTime(exampleDateTimes.old)).toBe('1/19/2022')
    })

    it('should show invalid when ISO incorrect', async () => {
      expect(getFormattedMessageTime(exampleDateTimes.invalid)).toBe('Invalid DateTime')
    })
  })
})
