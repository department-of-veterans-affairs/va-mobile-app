import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { CharacterOfServiceConstants, LetterTypeConstants } from 'store/api/types'
import { downloadLetter } from 'store/slices'
import { context, mockNavProps, render } from 'testUtils'

import BenefitSummaryServiceVerification from './BenefitSummaryServiceVerification'

const mockExternalLinkSpy = jest.fn()
jest.mock('utils/hooks', () => {
  return {
    ...jest.requireActual<typeof import('utils/hooks')>('utils/hooks'),
    useExternalLink: () => mockExternalLinkSpy,
  }
})

jest.mock('store/slices', () => {
  return {
    ...jest.requireActual<typeof import('store/slices')>('store/slices'),
    downloadLetter: jest.fn(() => ({ type: '', payload: '' })),
    getLetterBeneficiaryData: jest.fn(() => ({ type: '', payload: '' })),
  }
})

context('BenefitSummaryServiceVerification', () => {
  const { HONORABLE } = CharacterOfServiceConstants
  const date = '2013-06-06T15:00:00.000+00:00'
  const enteredDate = '1990-01-01T15:00:00.000+00:00'
  const releasedDate = '1993-10-01T15:00:00.000+00:00'

  const initializeTestInstance = (
    monthlyAwardAmount?: number,
    awardEffectiveDate?: string,
    serviceConnectedPercentage?: number,
    downloading = false,
    hasDownloadError = false,
  ) => {
    render(<BenefitSummaryServiceVerification {...mockNavProps()} />, {
      preloadedState: {
        letters: {
          loading: false,
          letters: [],
          downloading: downloading,
          letterDownloadError: hasDownloadError ? new Error('error') : undefined,
          mostRecentServices: [{ branch: 'Army', characterOfService: HONORABLE, enteredDate, releasedDate }],
          letterBeneficiaryData: {
            militaryService: [{ branch: 'Army', characterOfService: HONORABLE, enteredDate, releasedDate }],
            benefitInformation: {
              awardEffectiveDate: awardEffectiveDate || null,
              hasChapter35Eligibility: false,
              monthlyAwardAmount: monthlyAwardAmount || null,
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
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance(123, date, 88)
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('header', { name: 'Benefit summary and service verification letter' })).toBeTruthy()
    expect(
      screen.getByText(
        'This letter shows your service history and some benefit information. You can customize this letter and use it for many things, including to apply for housing assistance, civil service jobs, and state or local property and car tax relief.',
      ),
    ).toBeTruthy()
    expect(
      screen.getByRole('header', { name: 'Choose what information you want to include in your letter.' }),
    ).toBeTruthy()
    expect(screen.getAllByRole('header', { name: 'Military service information' })).toBeTruthy()
    expect(screen.getByTestId('branch-of-service-army')).toBeTruthy()
    expect(screen.getByTestId('discharge-type-honorable')).toBeTruthy()
    expect(screen.getByTestId('Active duty start January 01, 1990')).toBeTruthy()
    expect(screen.getByTestId('Separation date October 01, 1993')).toBeTruthy()
    expect(
      screen.getByText(
        "Our records list your 3 most recent service periods. You may have more service periods that aren't listed here.",
      ),
    ).toBeTruthy()
    expect(screen.getByRole('switch', { name: 'Include military service information' })).toBeTruthy()
    expect(screen.getAllByRole('header', { name: 'VA disability rating and compensation information' })).toBeTruthy()
    expect(
      screen.getByRole('switch', {
        name: 'Your current monthly payment is $123.00. The effective date of the last change to your current payment was June 06, 2013.',
      }),
    ).toBeTruthy()
    expect(screen.getByRole('switch', { name: 'Your combined service-connected rating is 88%.' })).toBeTruthy()
    expect(
      screen.getByRole('switch', {
        name: "You aren't considered to be totally and permanently disabled solely due to your service-connected disabilities.",
      }),
    ).toBeTruthy()
    expect(
      screen.getByRole('switch', { name: "You don't have one or more service-connected disabilities." }),
    ).toBeTruthy()
    expect(
      screen.getByText(
        'If your service period or disability status information is incorrect, contact us online through Ask VA.',
      ),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Go to Ask VA' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Review letter' })).toBeTruthy()
  })

  describe('on click of go to ask va', () => {
    it('should launch external link', () => {
      fireEvent.press(screen.getByRole('link', { name: 'Go to Ask VA' }))
      expect(mockExternalLinkSpy).toHaveBeenCalledWith('https://ask.va.gov/')
    })
  })

  describe('when downloading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(123, date, 88, true)
      expect(screen.getByText('Loading your letter...')).toBeTruthy()
    })
  })

  describe('when Review letter is pressed', () => {
    it('should call downloadLetter', () => {
      fireEvent.press(screen.getByRole('button', { name: 'Review letter' }))
      const letterOptions = {
        chapter35Eligibility: true,
        militaryService: true,
        monthlyAward: true,
        serviceConnectedDisabilities: true,
        serviceConnectedEvaluation: true,
      }
      expect(downloadLetter).toBeCalledWith(LetterTypeConstants.benefitSummary, letterOptions)
    })
  })

  describe('when the monthly award amount does not exist but the awardEffectiveDate does', () => {
    it('should display "Your current monthly award is $0.00. The effective date of the last change to your current award was {{date}}." for that switch', async () => {
      initializeTestInstance(undefined, date, 88)
      expect(
        screen.getByRole('switch', {
          name: 'Your current monthly payment is $0.00. The effective date of the last change to your current payment was June 06, 2013.',
        }),
      ).toBeTruthy()
    })
  })

  describe('when the awardEffectiveDate does not exist but the monthly payment amount does', () => {
    it('should display "Your current monthly award is ${{monthlyAwardAmount}}. The effective date of the last change to your current payment was invalid date." for that switch', async () => {
      initializeTestInstance(123, undefined, 88)
      expect(
        screen.getByRole('switch', {
          name: 'Your current monthly payment is $123.00. The effective date of the last change to your current payment was an invalid date.',
        }),
      ).toBeTruthy()
    })
  })

  describe('when the awardEffectiveDate does not exist and the monthly award amount does not exist', () => {
    it('should not display that switch on the screen', async () => {
      initializeTestInstance(undefined, undefined, 88)
      expect(
        screen.queryByRole('switch', {
          name: 'Your current monthly payment is $0.00. The effective date of the last change to your current award was an invalid date.',
        }),
      ).toBeFalsy()
    })
  })

  describe('when the service connected percentage does not exist', () => {
    it('should not display that switch', () => {
      initializeTestInstance(123, date)
      expect(screen.queryByRole('switch', { name: 'Your combined service-connected rating is 88%.' })).toBeFalsy()
    })
  })

  describe('when an error occurs', () => {
    it('should render error component when there is a letter download error', async () => {
      initializeTestInstance(123, date, undefined, undefined, true)
      expect(screen.getByText('Your letter could not be downloaded.')).toBeTruthy()
    })

    it('should not render error component when there is no letter download error', async () => {
      initializeTestInstance(123, date, undefined, undefined, false)
      expect(screen.queryByText('Your letter could not be downloaded.')).toBeFalsy()
    })
  })
})
