import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { DateTime } from 'luxon'

import OfflineBanner from 'components/OfflineBanner'
import { initialOfflineState } from 'store/slices'
import { context, render } from 'testUtils'
import { getFormattedDateAndTimeZone } from 'utils/formattingUtils'

jest.mock('utils/hooks/offline', () => {
  const original = jest.requireActual('utils/hooks/offline')

  return {
    ...original,
    useAppIsOnline: jest.fn().mockReturnValue('DISCONNECTED'),
  }
})

jest.mock('react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo', () => {
  return {
    _esModule: true,
    default: {
      announceForAccessibilityWithOptions: jest.fn(),
    },
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
      preloadedState: {
        offline: {
          ...initialOfflineState,
          offlineTimestamp: testDate,
        },
      },
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
