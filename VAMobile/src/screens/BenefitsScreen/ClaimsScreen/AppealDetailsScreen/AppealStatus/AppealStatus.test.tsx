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

  it('should initialize', () => {
    expect(screen.getByRole('tab', { name: 'Review past events' })).toBeTruthy()
    expect(screen.getByRole('header', { name: 'Current status' })).toBeTruthy()
    expect(screen.getByRole('header', { name: 'Your hearing has been scheduled' })).toBeTruthy()
    expect(screen.getByText('Your  hearing is scheduled for  at .')).toBeTruthy()
  })

  describe('when there are numAppealsAhead and isActiveAppeal is true', () => {
    it('should display Appeals ahead of you', () => {
      initializeTestInstance(12345, true)
      expect(screen.getByRole('header', { name: 'Appeals ahead of you' })).toBeTruthy()
    })
  })

  describe('when numAppealsAhead is undefined or isActiveAppeal is false', () => {
    it('should not render the num appeals ahead text area', () => {
      initializeTestInstance(undefined, true)
      expect(screen.queryByRole('header', { name: 'Appeals ahead of you' })).toBeFalsy()

      initializeTestInstance(123, false)
      expect(screen.queryByRole('header', { name: 'Appeals ahead of you' })).toBeFalsy()
    })
  })
})
