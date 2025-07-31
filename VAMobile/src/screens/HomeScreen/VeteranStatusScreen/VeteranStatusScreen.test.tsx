import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { disabilityRatingKeys } from 'api/disabilityRating'
import { militaryServiceHistoryKeys } from 'api/militaryService'
import { BranchesOfServiceConstants } from 'api/types'
import { veteranStatusKeys } from 'api/veteranStatus'
import VeteranStatusScreen from 'screens/HomeScreen/VeteranStatusScreen/VeteranStatusScreen'
import { QueriesData, context, mockNavProps, render } from 'testUtils'

jest.mock('utils/remoteConfig', () => ({
  activateRemoteConfig: jest.fn(() => Promise.resolve()),
  featureEnabled: jest.fn((flag: string) => {
    if (flag === 'veteranStatusCardRedesign') {
      return true
    }
    return false
  }),
}))

context('VeteranStatusScreen', () => {
  const confirmedData = {
    data: {
      id: '',
      type: 'veteran_status_confirmations',
      attributes: {
        veteranStatus: 'confirmed',
      },
    },
  }

  const noPercentRating = {
    combinedDisabilityRating: undefined,
    combinedEffectiveDate: '2022-06-15',
    legalEffectiveDate: '2022-05-01',
    individualRatings: [
      {
        decision: 'Service Connected',
        effectiveDate: '2022-04-01T00:00:00+00:00',
        ratingPercentage: 0,
        diagnosticText: 'Asthma, bronchial',
        type: 'Original',
      },
    ],
  }

  const sixtyPercentRating = {
    combinedDisabilityRating: 60,
    combinedEffectiveDate: '2022-06-15',
    legalEffectiveDate: '2022-05-01',
    individualRatings: [
      {
        decision: 'Service Connected',
        effectiveDate: '2022-04-01T00:00:00+00:00',
        ratingPercentage: 0,
        diagnosticText: 'Asthma, bronchial',
      },
      {
        decision: 'Service Connected',
        effectiveDate: '2021-11-14T00:00:00+00:00',
        ratingPercentage: 10,
        diagnosticText: 'hypertension',
      },
      {
        decision: 'Service Connected',
        effectiveDate: '2012-06-01T00:00:00+00:00',
        ratingPercentage: 50,
        diagnosticText: 'hearing loss',
      },
    ],
  }

  const serviceHistoryWithOnePeriod = {
    serviceHistory: [
      {
        branchOfService: 'United States Army',
        beginDate: '2002-01-01',
        endDate: '2006-12-31',
        formattedBeginDate: 'January 01, 2002',
        formattedEndDate: 'December 31, 2006',
        characterOfDischarge: 'Honorable',
        honorableServiceIndicator: 'Y',
      },
    ],
  }

  const multiPeriodServiceHistory = {
    serviceHistory: [
      {
        branchOfService: 'United States Army',
        beginDate: '2002-01-01',
        endDate: '2006-12-31',
        formattedBeginDate: 'January 01, 2002',
        formattedEndDate: 'December 31, 2006',
        characterOfDischarge: 'Honorable',
        honorableServiceIndicator: 'Y',
      },
      {
        branchOfService: 'United States Army',
        beginDate: '2010-01-01',
        endDate: '2017-12-31',
        formattedBeginDate: 'January 01, 2010',
        formattedEndDate: 'December 31, 2017',
        characterOfDischarge: 'Honorable',
        honorableServiceIndicator: 'Y',
      },
      {
        branchOfService: 'United States Army',
        beginDate: '2020-05-01',
        endDate: null,
        formattedBeginDate: 'May 01, 2020',
        formattedEndDate: null,
        characterOfDischarge: 'Honorable',
        honorableServiceIndicator: 'Y',
      },
    ],
  }

  const renderWithOptions = (queriesData?: QueriesData) => {
    const props = mockNavProps(
      {},
      {
        navigate: jest.fn(),
        addListener: jest.fn(),
      },
    )
    render(<VeteranStatusScreen {...props} />, { queriesData })
    jest.advanceTimersByTime(50)
  }

  describe('Errors', () => {
    const notConfirmedData = (notConfirmedReason: string) => {
      return {
        data: {
          id: '',
          type: 'veteran_status_confirmations',
          attributes: {
            veteranStatus: 'not confirmed',
            notConfirmedReason,
          },
        },
      }
    }
    const noTitle38Data = notConfirmedData('NOT_TITLE_38')
    const errorData = notConfirmedData('ERROR')
    const moreResearchNeededData = notConfirmedData('MORE_RESEARCH_NEEDED')
    const personNotFoundData = notConfirmedData('PERSON_NOT_FOUND')

    it('shows the NOT_TITLE_38 warning when users not-confirmed reason is NOT_TITLE_38', async () => {
      renderWithOptions([
        {
          queryKey: veteranStatusKeys.verification,
          data: noTitle38Data,
        },
      ])

      expect(screen.findByText(t('veteranStatus.error.notTitle38.title'))).toBeTruthy()
    })

    it('shows the ERROR warning when users not-confirmed reason is ERROR', async () => {
      renderWithOptions([
        {
          queryKey: veteranStatusKeys.verification,
          data: errorData,
        },
      ])

      expect(screen.findByText(t('errors.somethingWentWrong'))).toBeTruthy()
    })

    it('shows the catch-all warning when users not-confirmed reason is MORE_RESEARCH_NEEDED', async () => {
      renderWithOptions([
        {
          queryKey: veteranStatusKeys.verification,
          data: moreResearchNeededData,
        },
      ])

      expect(screen.findByText(t('veteranStatus.error.catchAll.title'))).toBeTruthy()
    })

    it('shows the catch-all warning when users not-confirmed reason is PERSON_NOT_FOUND', async () => {
      renderWithOptions([
        {
          queryKey: veteranStatusKeys.verification,
          data: personNotFoundData,
        },
      ])

      expect(screen.findByText(t('veteranStatus.error.catchAll.title'))).toBeTruthy()
    })

    it('shows the catch-all warning when user is confirmed, but has no military history', async () => {
      renderWithOptions([
        {
          queryKey: veteranStatusKeys.verification,
          data: confirmedData,
        },
        {
          queryKey: militaryServiceHistoryKeys.serviceHistory,
          data: {
            serviceHistory: [],
          },
        },
      ])

      expect(screen.findByText(t('veteranStatus.error.catchAll.title'))).toBeTruthy()
    })
  })

  describe('Veteran Status Card', () => {
    it('does NOT show the disability rating if combined disability rating does not exist', async () => {
      renderWithOptions([
        {
          queryKey: veteranStatusKeys.verification,
          data: confirmedData,
        },
        {
          queryKey: militaryServiceHistoryKeys.serviceHistory,
          data: serviceHistoryWithOnePeriod,
        },
        {
          queryKey: disabilityRatingKeys.disabilityRating,
          data: noPercentRating,
        },
      ])

      const zeroPercentText = t('disabilityRating.percent', { combinedPercent: 0 })
      expect(screen.queryByText(zeroPercentText)).toBeNull()
    })

    it('shows the disability rating if combined disability rating is 60', async () => {
      renderWithOptions([
        {
          queryKey: veteranStatusKeys.verification,
          data: confirmedData,
        },
        {
          queryKey: militaryServiceHistoryKeys.serviceHistory,
          data: serviceHistoryWithOnePeriod,
        },
        {
          queryKey: disabilityRatingKeys.disabilityRating,
          data: sixtyPercentRating,
        },
      ])

      const sixtyPercentText = t('disabilityRating.percent', { combinedPercent: 60 })
      expect(screen.getByText(sixtyPercentText)).toBeTruthy()
    })

    it('displays the second-most-recent completed service if the most recent has no end date', () => {
      renderWithOptions([
        {
          queryKey: veteranStatusKeys.verification,
          data: confirmedData,
        },
        {
          queryKey: militaryServiceHistoryKeys.serviceHistory,
          data: multiPeriodServiceHistory,
        },
        {
          queryKey: disabilityRatingKeys.disabilityRating,
          data: noPercentRating,
        },
      ])

      const secondPeriodText = 'United States Army • 2010–2017'
      expect(screen.getByText(secondPeriodText)).toBeTruthy()
    })

    for (const branch of Object.values(BranchesOfServiceConstants)) {
      it(`displays the correct branch of service text for ${branch}`, () => {
        const serviceHistory = {
          serviceHistory: [
            {
              branchOfService: branch,
              beginDate: '2010-01-01',
              endDate: '2014-12-31',
              formattedBeginDate: 'January 01, 2010',
              formattedEndDate: 'December 31, 2014',
              characterOfDischarge: 'Honorable',
              honorableServiceIndicator: 'Y',
            },
          ],
        }
        renderWithOptions([
          {
            queryKey: veteranStatusKeys.verification,
            data: confirmedData,
          },
          {
            queryKey: militaryServiceHistoryKeys.serviceHistory,
            data: serviceHistory,
          },
          {
            queryKey: disabilityRatingKeys.disabilityRating,
            data: noPercentRating,
          },
        ])
        expect(screen.getByText(`${branch} • 2010–2014`)).toBeTruthy()
      })
    }
  })
})
