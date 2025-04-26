import React from 'react'

import { screen } from '@testing-library/react-native'

import { contactInformationKeys } from 'api/contactInformation'
import { UserContactInformation } from 'api/types'
import { QueriesData, context, mockNavProps, render } from 'testUtils'

import SubmitMileageTravelPayScreen from './SubmitMileageTravelPayScreen'

const mockNavigationSpy = jest.fn()
const mockBack = jest.fn()

const params = {
  appointmentDateTime: '2021-01-01T00:00:00Z',
  facilityName: 'Test Facility',
}

const mockActionSheetSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
    useBeforeNavBackListener: jest.fn(),
    useDestructiveActionSheet: () => mockActionSheetSpy,
  }
})

context('SubmitMileageTravelPayScreen', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  const props = mockNavProps(
    undefined,
    { navigate: mockNavigationSpy, goBack: mockBack },
    {
      params,
    },
  )
  const initializeTestInstance = (initialIndex: number = 1, contactInformation?: Partial<UserContactInformation>) => {
    let queriesData: QueriesData | undefined
    if (contactInformation) {
      queriesData = [
        {
          queryKey: contactInformationKeys.contactInformation,
          data: {
            ...contactInformation,
          },
        },
      ]
    }
    render(<SubmitMileageTravelPayScreen {...props} initialRouteIndex={initialIndex} />, { queriesData })
  }

  it('should initialize correctly and show interstitial screen', () => {
    initializeTestInstance()
    expect(screen.getByTestId('InterstitialScreen')).toBeTruthy()
  })
})
