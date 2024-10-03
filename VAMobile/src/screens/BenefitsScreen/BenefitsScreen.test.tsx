import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'
import { DateTime } from 'luxon'

import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import { ClaimsAndAppealsGetDataMetaError } from 'api/types'
import { ClaimTypeConstants } from 'constants/claims'
import { RootState } from 'store'
import { get } from 'store/api'
import { ErrorsState } from 'store/slices'
import { context, mockNavProps, render, when } from 'testUtils'
import { getClaimsAndAppealsPayload } from 'utils/tests/personalization'

import { BenefitsScreen } from './BenefitsScreen'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('BenefitsScreen', () => {
  const initializeTestInstance = (
    activeClaimsCount?: number,
    serviceErrors?: Array<ClaimsAndAppealsGetDataMetaError>,
    preloadedState?: Partial<RootState>,
  ) => {
    const props = mockNavProps(undefined, { setOptions: jest.fn(), navigate: mockNavigationSpy })
    const queriesData = activeClaimsCount
      ? [
          {
            queryKey: [claimsAndAppealsKeys.claimsAndAppeals, ClaimTypeConstants.ACTIVE],
            data: getClaimsAndAppealsPayload(activeClaimsCount, serviceErrors),
          },
        ]
      : undefined
    render(<BenefitsScreen {...props} />, { preloadedState, queriesData })
  }

  it('displays active claims count when veteran has active claims', () => {
    const activeClaimsCount = 3
    initializeTestInstance(activeClaimsCount)
    expect(screen.getByRole('link', { name: t('claims.title') })).toBeTruthy()
    expect(
      screen.getByRole('link', { name: t('claims.activityButton.subText', { count: activeClaimsCount }) }),
    ).toBeTruthy()
  })

  it('does not display active claims count when there are no active claims', () => {
    const activeClaimsCount = 0
    initializeTestInstance(activeClaimsCount)
    expect(
      screen.queryByRole('link', { name: t('claims.activityButton.subText', { count: activeClaimsCount }) }),
    ).toBeFalsy()
  })

  it('navigates to Claims history screen when claims button is pressed', () => {
    initializeTestInstance(3)
    fireEvent.press(screen.getByRole('link', { name: t('claims.title') }))
    expect(mockNavigationSpy).toHaveBeenCalledWith('ClaimsHistoryScreen')
  })

  it('does not display active claims count when there is a service error', () => {
    const activeClaimsCount = 3
    const serviceErrors = [
      {
        service: 'claims',
        errorDetails: [{ title: 'Claims error' }],
      },
    ]

    initializeTestInstance(activeClaimsCount, serviceErrors)
    expect(
      screen.queryByRole('link', { name: t('claims.activityButton.subText', { count: activeClaimsCount }) }),
    ).toBeFalsy()
  })

  it('displays warning message when there is a service error', () => {
    const activeClaimsCount = 3
    const serviceErrors = [
      {
        service: 'claims',
        errorDetails: [{ title: 'Claims error' }],
      },
    ]

    initializeTestInstance(activeClaimsCount, serviceErrors)
    expect(screen.getByText(t('benefits.activity.nonFatalError'))).toBeTruthy()
  })

  it('displays downtime message when claims or appeals is in downtime', () => {
    const activeClaimsCount = 3
    const downtimeWindow = {
      startTime: DateTime.now(),
      endTime: DateTime.now().plus({ minutes: 1 }),
    }
    const preloadedState = {
      errors: {
        downtimeWindowsByFeature: {
          appeals: downtimeWindow,
          claims: downtimeWindow,
        },
      } as ErrorsState,
    }

    initializeTestInstance(activeClaimsCount, undefined, preloadedState)
    expect(screen.getByText(t('benefits.activity.warning.downtime'))).toBeTruthy()
  })

  it('does not display active claims when claims or appeals is in downtime', () => {
    const activeClaimsCount = 3
    const downtimeWindow = {
      startTime: DateTime.now(),
      endTime: DateTime.now().plus({ minutes: 1 }),
    }
    const preloadedState = {
      errors: {
        downtimeWindowsByFeature: {
          appeals: downtimeWindow,
          claims: downtimeWindow,
        },
      } as ErrorsState,
    }

    initializeTestInstance(activeClaimsCount, undefined, preloadedState)
    expect(
      screen.queryByRole('link', { name: t('claims.activityButton.subText', { count: activeClaimsCount }) }),
    ).toBeFalsy()
  })

  it('displays error message when the claims API call throws an error', async () => {
    when(get as jest.Mock)
      .calledWith('/v0/claims-and-appeals-overview', expect.anything())
      .mockRejectedValue('fail')
    initializeTestInstance()
    await waitFor(() => expect(screen.getByText(t('benefits.activity.error'))).toBeTruthy())
  })

  it('does not display active claims count when the claims API call throws an error', async () => {
    when(get as jest.Mock)
      .calledWith('/v0/claims-and-appeals-overview', expect.anything())
      .mockRejectedValue('fail')
    initializeTestInstance()
    await waitFor(() => expect(screen.getByText(t('benefits.activity.error'))).toBeTruthy())
    await waitFor(() => expect(screen.queryByText(t('active'))).toBeFalsy())
  })

  it("navigates to Letters screen when 'letters and document' button is pressed", () => {
    initializeTestInstance()
    fireEvent.press(screen.getByRole('link', { name: t('lettersAndDocs.title') }))
    expect(mockNavigationSpy).toHaveBeenCalledWith('LettersOverview')
  })

  it('navigates to Disability rating screen when Disability rating button is pressed', () => {
    initializeTestInstance()
    fireEvent.press(screen.getByRole('link', { name: t('disabilityRating.title') }))
    expect(mockNavigationSpy).toHaveBeenCalledWith('DisabilityRatings')
  })
})
