import React from 'react'

import { screen } from '@testing-library/react-native'

import Appointments from 'screens/HealthScreen/Appointments/Appointments'
import * as api from 'store/api'
import { setLastUpdatedTimestamp } from 'store/slices'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'
import { formatEpochReadable } from 'utils/formattingUtils'

// Mock remote config to enable offline mode behind the feature flag
jest.mock('utils/remoteConfig', () => ({
  activateRemoteConfig: jest.fn(() => Promise.resolve()),
  featureEnabled: jest.fn(() => true),
}))

// Currently there is an issue with useAppDispatch being declared as undefined in useQuery.
// Further investigation may be needed to improve unit test. For now, it is mocked and the
// lastUpdatedTimestamp is checked for a call.
// jest.mock('utils/hooks', () => {
//   const original = jest.requireActual('utils/hooks')
//   return {
//     ...original,
//     useAppDispatch: jest.fn().mockReturnValue(jest.fn()),
//   }
// })

// Mock setLastUpdatedTimestamp to ensure it is called after a successful fetch
jest.mock('store/slices', () => {
  return {
    ...jest.requireActual<typeof import('store/slices')>('store/slices'),
    setLastUpdatedTimestamp: jest.fn(),
  }
})

// Mock onlineManager to ensure online functionality is maintained
// let mockIsOnline: jest.Mock
// jest.mock('@tanstack/react-query', () => {
//   mockIsOnline = jest.fn().mockReturnValue(true)
//   const original = jest.requireActual('@tanstack/react-query')
//   return {
//     ...original,
//     onlineManager: {
//       ...original.onlineManager,
//       isOnline: mockIsOnline,
//     },
//   }
// })

const appointmentData = {
  data: [
    {
      id: '1',
      type: 'appointment',
      attributes: {},
    },
  ],
}

context('Appointments Offline Mode', () => {
  describe('Online', () => {
    const lastUpdatedTimestamp = Date.now()
    beforeEach(() => {
      // mockIsOnline.mockImplementation(jest.fn().mockReturnValue(true))
      when(api.get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockResolvedValueOnce(appointmentData)
      render(<Appointments {...mockNavProps()} />, {
        preloadedState: {
          offline: {
            lastUpdatedTimestamps: {
              'appointments,upcoming': lastUpdatedTimestamp,
            },
          },
        },
      })
    })

    it('should set the last updated time when data is successfully fetched', async () => {
      await waitFor(() => expect(setLastUpdatedTimestamp).toBeCalled())
    })

    it('should display existing last updated timestamp', async () => {
      await waitFor(() =>
        expect(screen.getByText(`Last updated ${formatEpochReadable(lastUpdatedTimestamp / 1000)}`)).toBeTruthy(),
      )
    })
  })

  describe('Offline', () => {
    beforeEach(() => {})
    it('should render an empty state if there are no cached appointments', async () => {
      render(<Appointments {...mockNavProps()} />)
      await waitFor(() => expect(screen.getByTestId('content-unavailable')).toBeTruthy())
    })
    it('should render appointments when device goes offline if they are cached', () => {})
  })
})
