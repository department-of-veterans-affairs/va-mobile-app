import React from 'react'

import { screen } from '@testing-library/react-native'
import { waitFor } from '@testing-library/react-native'
import { t } from 'i18next'
import { when } from 'jest-when'

import MaintenanceBanner, { MaintenanceBannerProps } from 'components/MaintenanceBanner'
import { MaintenanceWindowsEntry, get } from 'store/api'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { context, render } from 'testUtils'

jest.mock('@react-navigation/native', () => {
  const original = jest.requireActual('@react-navigation/native')
  return {
    ...original,
    useNavigationState: () => {
      return () => {
        return 'appointment'
      }
    },
  }
})

context('MaintenanceBanner', () => {
  const initializeTestInstance = (props?: MaintenanceBannerProps) => {
    render(<MaintenanceBanner {...props} />, {
      preloadedState: {
        auth: {
          loggedIn: true,
        },
      },
    })
  }

  it('should not render if no screenID', () => {
    initializeTestInstance()
    expect(screen.queryByText('Hello World')).toBeFalsy()
  })

  it('should not render if screen is not included in the white list', () => {
    initializeTestInstance({
      screenID: ScreenIDTypesConstants.ALLERGY_LIST_SCREEN_ID,
    })
    expect(screen.queryByText('Hello World')).toBeFalsy()
  })

  it('should not render if not in downtime and not in downtime window', () => {
    initializeTestInstance({
      screenID: ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID,
    })
    expect(screen.queryByText('Hello World')).toBeFalsy()
  })

  it('renders in progress', async () => {
    const oneHourLater = new Date()
    oneHourLater.setHours(oneHourLater.getHours() + 1)
    when(get as jest.Mock)
      .calledWith('/v0/maintenance_windows')
      .mockReturnValue({
        data: [
          {
            attributes: {
              service: 'appointments',
              startTime: new Date().toISOString(),
              endTime: oneHourLater.toISOString(),
            },
            id: '',
            type: '',
          },
        ] as MaintenanceWindowsEntry[],
      })

    initializeTestInstance({
      screenID: ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID,
    })
    await waitFor(() => {
      expect(screen.getByText(t('maintenanceBanner.header'))).toBeTruthy()
    })
  })

  it('renders upcoming maintenance', async () => {
    const oneHourLater = new Date()
    oneHourLater.setHours(oneHourLater.getHours() + 1)
    const twoHourLater = new Date()
    twoHourLater.setHours(twoHourLater.getHours() + 1)
    when(get as jest.Mock)
      .calledWith('/v0/maintenance_windows')
      .mockReturnValue({
        data: [
          {
            attributes: {
              service: 'appointments',
              startTime: oneHourLater.toISOString(),
              endTime: twoHourLater.toISOString(),
            },
            id: '',
            type: '',
          },
        ] as MaintenanceWindowsEntry[],
      })

    initializeTestInstance({
      screenID: ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID,
    })
    await waitFor(() => {
      expect(screen.getByText(t('maintenanceBanner.header.upcoming'))).toBeTruthy()
    })
  })
})
