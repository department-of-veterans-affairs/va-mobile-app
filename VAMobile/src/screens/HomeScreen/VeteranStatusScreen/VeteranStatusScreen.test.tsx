import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { disabilityRatingKeys } from 'api/disabilityRating'
import { militaryServiceHistoryKeys } from 'api/militaryService'
import { veteranStatusCardKeys } from 'api/veteranStatusCard'
import { BranchesOfServiceConstants } from 'api/types'
import { veteranStatusKeys } from 'api/veteranStatus'
import VeteranStatusScreen from 'screens/HomeScreen/VeteranStatusScreen/VeteranStatusScreen'
import { QueriesData, context, mockNavProps, render } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

jest.mock('utils/remoteConfig', () => ({
  featureEnabled: jest.fn(() => false),
}))

context('VeteranStatusScreen', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    jest.clearAllMocks()

      // Default: legacy path (existing tests depend on this)
      ; (featureEnabled as jest.Mock).mockImplementation((key: string) => {
        if (key === 'veteranStatusCardUpdate') return false
        return false
      })
  })

  // -----------------------------
  // Legacy mock payloads
  // -----------------------------
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

  // -----------------------------
  // NEW VSC endpoint mock payloads
  // -----------------------------
  const vscCardConfirmedNoRating = {
    type: 'veteran_status_card',
    attributes: {
      fullName: 'Irma Stephanie Phillips',
      edipi: '1100377582',
      disabilityRating: null,
      latestService: {
        branch: 'United States Army',
        beginDate: '2010-01-01',
        endDate: '2014-12-31',
      },
      veteranStatus: 'confirmed',
      serviceHistoryStatus: 'found',
      serviceSummaryCode: 'A1',
      // notConfirmedReason omitted when confirmed
    },
  }

  const vscCardConfirmedSixty = {
    ...vscCardConfirmedNoRating,
    attributes: {
      ...vscCardConfirmedNoRating.attributes,
      disabilityRating: 60,
    },
  }

  const vscAlertNotTitle38 = {
    type: 'veteran_status_alert',
    attributes: {
      alertType: 'warning',
      header: 'You don’t have Title 38 veteran status',
      body: [{ type: 'text', value: 'Call us so we can help.' }],
      veteranStatus: 'not confirmed',
      notConfirmedReason: 'NOT_TITLE_38',
      serviceHistoryStatus: 'found',
      serviceSummaryCode: 'A1',
    },
  }

  const vscAlertError = {
    type: 'veteran_status_alert',
    attributes: {
      alertType: 'error',
      header: t('errors.somethingWentWrong'),
      body: [{ type: 'text', value: t('veteranStatus.error.generic') }],
      veteranStatus: 'not confirmed',
      notConfirmedReason: 'ERROR',
      serviceHistoryStatus: '500',
      serviceSummaryCode: 'A1',
    },
  }

  const vscAlertCatchAll = {
    type: 'veteran_status_alert',
    attributes: {
      alertType: 'warning',
      header: t('veteranStatus.error.catchAll.title'),
      body: [{ type: 'text', value: t('veteranStatus.error.catchAll.body') }],
      veteranStatus: 'not confirmed',
      notConfirmedReason: 'MORE_RESEARCH_REQUIRED',
      serviceHistoryStatus: 'found',
      serviceSummaryCode: 'A1',
    },
  }

  const vscAlertNoServiceHistory = {
    type: 'veteran_status_alert',
    attributes: {
      alertType: 'warning',
      header: t('veteranStatus.error.catchAll.title'),
      body: [{ type: 'text', value: t('veteranStatus.error.catchAll.body') }],
      veteranStatus: 'confirmed',
      serviceHistoryStatus: 'empty',
      serviceSummaryCode: 'A1',
    },
  }

  const baseRender = (queriesData?: QueriesData) => {
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
    const notConfirmedData = (notConfirmedReason: string) => ({
      data: {
        id: '',
        type: 'veteran_status_confirmations',
        attributes: {
          veteranStatus: 'not confirmed',
          notConfirmedReason,
        },
      },
    })

    const noTitle38Data = notConfirmedData('NOT_TITLE_38')
    const errorData = notConfirmedData('ERROR')
    const moreResearchRequiredData = notConfirmedData('MORE_RESEARCH_REQUIRED')
    const personNotFoundData = notConfirmedData('PERSON_NOT_FOUND')

    it('shows the NOT_TITLE_38 warning when users not-confirmed reason is NOT_TITLE_38', async () => {
      baseRender([{ queryKey: veteranStatusKeys.verification, data: noTitle38Data }])
      expect(await screen.findByText(t('veteranStatus.error.notTitle38.title'))).toBeTruthy()
    })

    it('shows the ERROR warning when users not-confirmed reason is ERROR', async () => {
      baseRender([{ queryKey: veteranStatusKeys.verification, data: errorData }])
      expect(await screen.findByText(t('errors.somethingWentWrong'))).toBeTruthy()
    })

    it('shows the catch-all warning when users not-confirmed reason is MORE_RESEARCH_REQUIRED', async () => {
      baseRender([{ queryKey: veteranStatusKeys.verification, data: moreResearchRequiredData }])
      expect(await screen.findByText(t('veteranStatus.error.catchAll.title'))).toBeTruthy()
    })

    it('shows the catch-all warning when users not-confirmed reason is PERSON_NOT_FOUND', async () => {
      baseRender([{ queryKey: veteranStatusKeys.verification, data: personNotFoundData }])
      expect(await screen.findByText(t('veteranStatus.error.catchAll.title'))).toBeTruthy()
    })

    it('shows the catch-all warning when user is confirmed, but has no military history', async () => {
      baseRender([
        { queryKey: veteranStatusKeys.verification, data: confirmedData },
        { queryKey: militaryServiceHistoryKeys.serviceHistory, data: { serviceHistory: [] } },
      ])
      expect(await screen.findByText(t('veteranStatus.error.catchAll.title'))).toBeTruthy()
    })
  })

  describe('Veteran Status Card', () => {
    it('does NOT show the disability rating if combined disability rating does not exist', () => {
      baseRender([
        { queryKey: veteranStatusKeys.verification, data: confirmedData },
        { queryKey: militaryServiceHistoryKeys.serviceHistory, data: serviceHistoryWithOnePeriod },
        { queryKey: disabilityRatingKeys.disabilityRating, data: noPercentRating },
      ])

      const zeroPercentText = t('disabilityRating.percent', { combinedPercent: 0 })
      expect(screen.queryByText(zeroPercentText)).toBeNull()
    })

    it('shows the disability rating if combined disability rating is 60', async () => {
      baseRender([
        { queryKey: veteranStatusKeys.verification, data: confirmedData },
        { queryKey: militaryServiceHistoryKeys.serviceHistory, data: serviceHistoryWithOnePeriod },
        { queryKey: disabilityRatingKeys.disabilityRating, data: sixtyPercentRating },
      ])

      const sixtyPercentText = t('disabilityRating.percent', { combinedPercent: 60 })
      expect(await screen.findByText(sixtyPercentText)).toBeTruthy()
    })

    it('displays the second-most-recent completed service if the most recent has no end date', async () => {
      baseRender([
        { queryKey: veteranStatusKeys.verification, data: confirmedData },
        { queryKey: militaryServiceHistoryKeys.serviceHistory, data: multiPeriodServiceHistory },
        { queryKey: disabilityRatingKeys.disabilityRating, data: noPercentRating },
      ])

      expect(await screen.findByText('United States Army • 2010–2017')).toBeTruthy()
    })

    for (const branch of Object.values(BranchesOfServiceConstants)) {
      it(`displays the correct branch of service text for ${branch}`, async () => {
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

        baseRender([
          { queryKey: veteranStatusKeys.verification, data: confirmedData },
          { queryKey: militaryServiceHistoryKeys.serviceHistory, data: serviceHistory },
          { queryKey: disabilityRatingKeys.disabilityRating, data: noPercentRating },
        ])

        expect(await screen.findByText(`${branch} • 2010–2014`)).toBeTruthy()
      })
    }
  })

  // ---------------------------------------------------------
  // New VSC tests (feature flag ON)
  // ---------------------------------------------------------
  describe('New VSC logic (veteranStatusCardUpdate feature flag ON)', () => {
    beforeEach(() => {
      ; (featureEnabled as jest.Mock).mockImplementation((key: string) => {
        if (key === 'veteranStatusCardUpdate') return true
        return false
      })
    })

    const renderWithNewVsc = (queriesData?: QueriesData) => {
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
      it('renders backend alert content for NOT_TITLE_38', async () => {
        renderWithNewVsc([{ queryKey: veteranStatusCardKeys.card, data: vscAlertNotTitle38 }])

        expect(await screen.findByText(vscAlertNotTitle38.attributes.header)).toBeTruthy()
        expect(await screen.findByText('Call us so we can help.')).toBeTruthy()
      })

      it('renders backend alert content for ERROR', async () => {
        renderWithNewVsc([{ queryKey: veteranStatusCardKeys.card, data: vscAlertError }])

        expect(await screen.findByText(t('errors.somethingWentWrong'))).toBeTruthy()
        expect(await screen.findByText(t('veteranStatus.error.generic'))).toBeTruthy()
      })

      it('renders catch-all warning when backend returns catch-all alert', async () => {
        renderWithNewVsc([{ queryKey: veteranStatusCardKeys.card, data: vscAlertCatchAll }])

        expect(await screen.findByText(t('veteranStatus.error.catchAll.title'))).toBeTruthy()
      })

      it('renders catch-all warning when confirmed but service history is empty (backend-driven)', async () => {
        renderWithNewVsc([{ queryKey: veteranStatusCardKeys.card, data: vscAlertNoServiceHistory }])

        expect(await screen.findByText(t('veteranStatus.error.catchAll.title'))).toBeTruthy()
      })
    })

    describe('Veteran Status Card', () => {
      it('does NOT show disability rating when disabilityRating is null', async () => {
        renderWithNewVsc([{ queryKey: veteranStatusCardKeys.card, data: vscCardConfirmedNoRating }])

        const zeroPercentText = t('disabilityRating.percent', { combinedPercent: 0 })
        expect(screen.queryByText(zeroPercentText)).toBeNull()
      })

      it('shows disability rating when disabilityRating is 60', async () => {
        renderWithNewVsc([{ queryKey: veteranStatusCardKeys.card, data: vscCardConfirmedSixty }])

        const sixtyPercentText = t('disabilityRating.percent', { combinedPercent: 60 })
        expect(await screen.findByText(sixtyPercentText)).toBeTruthy()
      })

      it('shows latest service period from latestService', async () => {
        renderWithNewVsc([{ queryKey: veteranStatusCardKeys.card, data: vscCardConfirmedNoRating }])

        expect(await screen.findByText('United States Army • 2010–2014')).toBeTruthy()
      })

      for (const branch of Object.values(BranchesOfServiceConstants)) {
        it(`displays the correct branch of service text for ${branch}`, async () => {
          renderWithNewVsc([
            {
              queryKey: veteranStatusCardKeys.card,
              data: {
                ...vscCardConfirmedNoRating,
                attributes: {
                  ...vscCardConfirmedNoRating.attributes,
                  latestService: { branch, beginDate: '2010-01-01', endDate: '2014-12-31' },
                },
              },
            },
          ])

          expect(await screen.findByText(`${branch} • 2010–2014`)).toBeTruthy()
        })
      }
    })
  })
})
