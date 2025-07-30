import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { CharacterOfServiceConstants } from 'api/types'
import BenefitSummaryServiceVerification from 'screens/BenefitsScreen/Letters/BenefitSummaryServiceVerification/BenefitSummaryServiceVerification'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'
import { roundToHundredthsPlace } from 'utils/formattingUtils'

const mockExternalLinkSpy = jest.fn()
jest.mock('utils/hooks', () => {
  return {
    ...jest.requireActual<typeof import('utils/hooks')>('utils/hooks'),
    useExternalLink: () => mockExternalLinkSpy,
  }
})

context('BenefitSummaryServiceVerification', () => {
  const { HONORABLE } = CharacterOfServiceConstants
  const date = '2013-06-06T15:00:00.000+00:00'
  const enteredDate = '1990-01-01T15:00:00.000+00:00'
  const releasedDate = '1993-10-01T15:00:00.000+00:00'

  const initializeMockApiResponse = (
    monthlyAwardAmount?: number,
    awardEffectiveDate?: string,
    serviceConnectedPercentage?: number,
  ) => {
    when(api.get as jest.Mock)
      .calledWith('/v0/letters/beneficiary')
      .mockResolvedValueOnce({
        data: {
          attributes: {
            militaryService: [{ branch: 'Army', characterOfService: HONORABLE, enteredDate, releasedDate }],
            benefitInformation: {
              awardEffectiveDate: awardEffectiveDate || null,
              hasChapter35Eligibility: false,
              monthlyAwardAmount: monthlyAwardAmount || monthlyAwardAmount === 0 ? monthlyAwardAmount : null,
              serviceConnectedPercentage: serviceConnectedPercentage || null,
              hasDeathResultOfDisability: false,
              hasSurvivorsIndemnityCompensationAward: true,
              hasSurvivorsPensionAward: false,
              hasAdaptedHousing: true,
              hasIndividualUnemployabilityGranted: false,
              hasNonServiceConnectedPension: true,
              hasServiceConnectedDisabilities: false,
              hasSpecialMonthlyCompensation: true,
            },
          },
        },
      })
  }

  const initializeTestInstance = (
    monthlyAwardAmount?: number,
    awardEffectiveDate?: string,
    serviceConnectedPercentage?: number,
  ) => {
    initializeMockApiResponse(monthlyAwardAmount, awardEffectiveDate, serviceConnectedPercentage)
    render(<BenefitSummaryServiceVerification {...mockNavProps()} />)
  }

  it('initializes correctly', async () => {
    initializeTestInstance(123, date, 88)
    await waitFor(() => expect(screen.getByRole('header', { name: t('letters.benefitService.title') })).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('letters.benefitService.summary'))).toBeTruthy())
    await waitFor(() =>
      expect(screen.getByRole('header', { name: t('letters.benefitService.chooseIncludedInformation') })).toBeTruthy(),
    )
    await waitFor(() =>
      expect(
        screen.getAllByRole('header', { name: t('letters.benefitService.militaryServiceInformation') }),
      ).toBeTruthy(),
    )
    await waitFor(() => expect(screen.getByTestId('branch-of-service-army')).toBeTruthy())
    await waitFor(() => expect(screen.getByTestId('discharge-type-honorable')).toBeTruthy())
    await waitFor(() => expect(screen.getByTestId('Active duty start January 01, 1990')).toBeTruthy())
    await waitFor(() => expect(screen.getByTestId('Separation date October 01, 1993')).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('letters.benefitService.ourRecordsShow'))).toBeTruthy())
    await waitFor(() =>
      expect(screen.getByRole('switch', { name: t('letters.benefitService.includeMilitaryServiceInfo') })).toBeTruthy(),
    )
    await waitFor(() =>
      expect(
        screen.getAllByRole('header', { name: t('letters.benefitService.benefitAndDisabilityInfo') }),
      ).toBeTruthy(),
    )
    await waitFor(() =>
      expect(
        screen.getByRole('switch', {
          name:
            t('letters.benefitService.monthlyAward', {
              monthlyAwardAmount: roundToHundredthsPlace(123),
            }) +
            t('letters.benefitService.effectiveDate', {
              date: 'June 06, 2013',
            }),
        }),
      ).toBeTruthy(),
    )
    await waitFor(() =>
      expect(
        screen.getByRole('switch', {
          name: t('letters.benefitService.combinedServiceConnectingRating', { rating: 88 }),
        }),
      ).toBeTruthy(),
    )
    await waitFor(() =>
      expect(
        screen.getByRole('switch', {
          name: t('letters.benefitService.disabledDueToService', { areOrNot: "aren't" }),
        }),
      ).toBeTruthy(),
    )
    await waitFor(() =>
      expect(
        screen.getByRole('switch', {
          name: t('letters.benefitService.oneOrMoreServiceDisabilities', { haveOrNot: "don't have" }),
        }),
      ).toBeTruthy(),
    )
    await waitFor(() => expect(screen.getByText(t('letters.benefitService.sendMessageIfIncorrectInfo'))).toBeTruthy())
    await waitFor(() =>
      expect(screen.getByRole('link', { name: t('letters.benefitService.sendMessage') })).toBeTruthy(),
    )
    await waitFor(() =>
      expect(screen.getByRole('button', { name: t('letters.benefitService.viewLetter') })).toBeTruthy(),
    )
  })

  describe('when the monthly award amount does not exist', () => {
    it('should not display that switch on the screen', async () => {
      initializeTestInstance(undefined, date, 88)
      await waitFor(() => expect(screen.queryByTestId('monthly-award')).toBeFalsy())
    })
  })

  describe('when the monthly award amount is $0 and the awardEffectiveDate exists', () => {
    it('should display "Your current monthly award is $0.00. The effective date of the last change to your current award was {{date}}." for that switch', async () => {
      initializeTestInstance(0, date, 88)
      await waitFor(() =>
        expect(
          screen.getByRole('switch', {
            name:
              t('letters.benefitService.monthlyAward', {
                monthlyAwardAmount: roundToHundredthsPlace(0),
              }) +
              t('letters.benefitService.effectiveDate', {
                date: 'June 06, 2013',
              }),
          }),
        ).toBeTruthy(),
      )
    })
  })

  describe('when the monthly award amount is $0 and the awardEffectiveDate does not exist', () => {
    it('should display "Your current monthly award is $0.00." for that switch', async () => {
      initializeTestInstance(0, undefined, 88)
      await waitFor(() =>
        expect(
          screen.getByRole('switch', {
            name: t('letters.benefitService.monthlyAward', {
              monthlyAwardAmount: roundToHundredthsPlace(0),
            }),
          }),
        ).toBeTruthy(),
      )
    })
  })

  describe('when the awardEffectiveDate does not exist but the monthly payment amount does and is non-zero', () => {
    it('should display "Your current monthly award is ${{monthlyAwardAmount}}." for that switch', async () => {
      initializeTestInstance(123, undefined, 88)
      await waitFor(() =>
        expect(
          screen.getByRole('switch', {
            name: t('letters.benefitService.monthlyAward', {
              monthlyAwardAmount: roundToHundredthsPlace(123),
            }),
          }),
        ).toBeTruthy(),
      )
    })
  })

  describe('when the service connected percentage does not exist', () => {
    it('should not display that switch', async () => {
      initializeTestInstance(123, date)
      await waitFor(() =>
        expect(
          screen.queryByRole('switch', {
            name: t('letters.benefitService.combinedServiceConnectingRating', { rating: 88 }),
          }),
        ).toBeFalsy(),
      )
    })
  })

  describe('when the service fails to load letter beneficiary data', () => {
    it('should show alert to reload the letter', async () => {
      // Failed api response
      when(api.get as jest.Mock)
        .calledWith('/v0/letters/beneficiary', expect.anything())
        .mockRejectedValueOnce({
          status: 400,
          networkError: true,
        })

      render(<BenefitSummaryServiceVerification {...mockNavProps()} />)

      // Alert should render with reload letter button
      await waitFor(() => {
        expect(screen.getByTestId('letterBeneficiaryError')).toBeTruthy()
      })

      // Successful api response
      initializeMockApiResponse()

      // Press reload letter button
      fireEvent.press(screen.getByTestId('reloadLetter'))

      // Alert should no longer be rendered after reloading letter successfully
      await waitFor(() => {
        expect(screen.queryByTestId('letterBeneficiaryError')).toBeNull()
      })
    })
  })
})
