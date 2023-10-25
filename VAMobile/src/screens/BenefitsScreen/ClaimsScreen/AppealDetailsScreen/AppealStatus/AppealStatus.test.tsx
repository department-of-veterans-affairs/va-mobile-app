import 'react-native'
import React from 'react'

import { screen } from '@testing-library/react-native'
import { context, mockNavProps, render } from 'testUtils'
import AppealStatus from './AppealStatus'

context('AppealStatus', () => {
  const initializeTestInstance = (numAppealsAhead: number | undefined, isActiveAppeal?: boolean) => {
    const props = mockNavProps({
      events: [
        {
          data: '2020-11-12',
          type: 'hlr_request',
        },
      ],
      status: {
        details: {},
        type: 'scheduled_hearing',
      },
      aoj: 'vba',
      appealType: 'higherLevelReview',
      numAppealsAhead,
      isActiveAppeal,
    })

    render(<AppealStatus {...props} />)
  }

  beforeEach(() => {
    initializeTestInstance(undefined)
  })

  it('should initialize', async () => {
    expect(screen.getByText('Review past events')).toBeTruthy()
    expect(screen.getByText('Current status')).toBeTruthy()
    expect(screen.getByText('Your hearing has been scheduled')).toBeTruthy()
    expect(screen.getByText('Your  hearing is scheduled for  at .')).toBeTruthy()
    expect(screen.getByText('Need help?')).toBeTruthy()
    expect(screen.getByText("Call our VA benefits hotline. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.")).toBeTruthy()
    expect(screen.getByText('800-827-1000')).toBeTruthy()
    expect(screen.getByText('To review more details about your appeal, visit VA.gov: ')).toBeTruthy()
    expect(screen.getByText('Visit VA.gov')).toBeTruthy()
  })

  describe('when there are numAppealsAhead and isActiveAppeal is true', () => {
    it('should display Appeals ahead of you', async () => {
      initializeTestInstance(12345, true)
      expect(screen.getByText('Appeals ahead of you')).toBeTruthy()
    })
  })

  describe('when numAppealsAhead is undefined or isActiveAppeal is false', () => {
    it('should not render the num appeals ahead text area', async () => {
      initializeTestInstance(undefined, true)
      expect(screen.queryByText('Appeals ahead of you')).toBeFalsy()

      initializeTestInstance(123, false)
      expect(screen.queryByText('Appeals ahead of you')).toBeFalsy()
    })
  })
})
