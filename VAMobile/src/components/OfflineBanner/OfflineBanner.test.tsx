import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { DateTime } from 'luxon'

import OfflineBanner from 'components/OfflineBanner'
import { context, render } from 'testUtils'
import { getFormattedDateAndTimeZone } from 'utils/formattingUtils'
import { CONNECTION_STATUS } from 'utils/hooks/offline'

jest.mock('utils/hooks/offline', () => {
  const original = jest.requireActual('utils/hooks/offline')

  return {
    ...original,
    useAppIsOnline: jest.fn().mockReturnValue(CONNECTION_STATUS.DISCONNECTED),
  }
})

context('OfflineBanner', () => {
  const testDate = DateTime.fromISO('2025-10-20T12:00:00.000Z')

  beforeEach(() => {
    jest.setSystemTime(testDate.toMillis())
  })

  const initializeTest = (mockIsOffline: boolean) => {
    const renderParams = {
      isOnline: !mockIsOffline,
    }
    render(<OfflineBanner />, renderParams)
  }

  it('should render the offline banner when offline', async () => {
    initializeTest(true)

    expect(screen.getByText('No internet connection')).toBeTruthy()
    const bannerButton = await screen.findByRole('button')
    fireEvent.press(bannerButton)
    expect(screen.getByText(`Last connected ${getFormattedDateAndTimeZone(testDate.toISO() || '')}`)).toBeTruthy()
  })
})
