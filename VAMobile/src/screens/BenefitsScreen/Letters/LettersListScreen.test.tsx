import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'
import { when } from 'jest-when'

import { authorizedServicesKeys } from 'api/authorizedServices/queryKeys'
import { LettersList } from 'api/types'
import * as api from 'store/api'
import { APIError } from 'store/api/types'
import { context, mockNavProps, render, waitFor } from 'testUtils'

import { LettersListScreen } from './index'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  return {
    ...jest.requireActual<typeof import('utils/hooks')>('utils/hooks'),
    useRouteNavigation: () => mockNavigationSpy,
  }
})

const lettersData: LettersList = [
  {
    name: 'Commissary letter',
    letterType: 'commissary',
  },
  {
    name: 'Proof of Service Letter',
    letterType: 'proof_of_service',
  },
  {
    name: 'Proof of Creditable Prescription Drug Coverage Letter',
    letterType: 'medicare_partd',
  },
  {
    name: 'Proof of Minimum Essential Coverage Letter',
    letterType: 'minimum_essential_coverage',
  },
  {
    name: 'Service Verification Letter',
    letterType: 'service_verification',
  },
  {
    name: 'Civil Service Preference Letter',
    letterType: 'civil_service',
  },
  {
    name: 'Benefit Summary and Service Verification Letter',
    letterType: 'benefit_summary',
  },
  {
    name: 'Benefit Verification Letter',
    letterType: 'benefit_verification',
  },
]

context('LettersListScreen', () => {
  const initializeTestInstance = (lettersList: LettersList | null, throwError: boolean = false, authorized = true) => {
    if (throwError) {
      when(api.get as jest.Mock)
        .calledWith('/v0/letters')
        .mockRejectedValue({ networkError: true } as APIError)
    } else {
      when(api.get as jest.Mock)
        .calledWith('/v0/letters')
        .mockResolvedValue({ data: { attributes: { letters: lettersList } } })
    }

    render(<LettersListScreen {...mockNavProps()} />, {
      queriesData: [
        {
          queryKey: authorizedServicesKeys.authorizedServices,
          data: {
            appeals: true,
            appointments: true,
            claims: true,
            decisionLetters: true,
            directDepositBenefits: true,
            directDepositBenefitsUpdate: true,
            disabilityRating: true,
            lettersAndDocuments: authorized,
            militaryServiceHistory: true,
            paymentHistory: true,
            preferredName: true,
            prescriptions: true,
            scheduleAppointments: true,
            secureMessaging: true,
            userProfileUpdate: true,
          },
        },
      ],
    })
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when lettersAndDocuments is set to false', () => {
    it('should show noLettersScreen', async () => {
      initializeTestInstance(lettersData, false, false)
      await waitFor(() => expect(screen.getByText(t('noLetters.header'))).toBeTruthy())
    })
  })

  it('should render correctly', async () => {
    initializeTestInstance(lettersData)
    expect(screen.getByText(t('letters.list.loading'))).toBeTruthy()
    await waitFor(() => expect(screen.getByRole('link', { name: t('letters.benefitService.title') })).toBeTruthy())
    await waitFor(() => expect(screen.getByRole('link', { name: 'Benefit verification letter' })).toBeTruthy())
    await waitFor(() => expect(screen.getByRole('link', { name: 'Civil service preference letter' })).toBeTruthy())
    await waitFor(() => expect(screen.getByRole('link', { name: 'Commissary letter' })).toBeTruthy())
    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'Proof of creditable prescription drug coverage letter' })).toBeTruthy(),
    )
    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'Proof of minimum essential coverage letter' })).toBeTruthy(),
    )
    await waitFor(() => expect(screen.getByRole('link', { name: t('letters.proofOfServiceCard') })).toBeTruthy())
    await waitFor(() => expect(screen.getByRole('link', { name: 'Service verification letter' })).toBeTruthy())
  })

  describe('when a link is clicked', () => {
    it('should call navigations navigate for Benefit Summary Service Verification Letter', async () => {
      initializeTestInstance(lettersData)
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: t('letters.benefitService.title') })))
      await waitFor(() => expect(mockNavigationSpy).toHaveBeenCalledWith('BenefitSummaryServiceVerificationLetter'))
    })

    it('should call navigations navigate for Benefit Verification Letter', async () => {
      initializeTestInstance(lettersData)
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: 'Benefit verification letter' })))
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('GenericLetter', {
          description: t('letters.benefitVerification.description'),
          descriptionA11yLabel:
            'This letter shows the benefits you’re receiving from  V-A . The letter also shows your benefit gross amount (the amount before anything is taken out) and net amount (the amount after deductions are taken out), your benefit effective date, and your disability rating.',
          header: 'Benefit verification letter',
          letterType: 'benefit_verification',
          screenID: 'BENEFIT_VERIFICATION_LETTER_SCREEN',
        }),
      )
    })

    it('should call navigations navigate for Civil Service Letter', async () => {
      initializeTestInstance(lettersData)
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: 'Civil service preference letter' })))
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('GenericLetter', {
          description: t('letters.civilService.description'),
          header: 'Civil service preference letter',
          letterType: 'civil_service',
          screenID: 'CIVIL_SERVICE_LETTER_SCREEN',
        }),
      )
    })

    it('should call navigations navigate for Commissary Letter', async () => {
      initializeTestInstance(lettersData)
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: 'Commissary letter' })))
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('GenericLetter', {
          description: t('letters.commissary.description'),
          header: 'Commissary letter',
          letterType: 'commissary',
          screenID: 'COMMISSARY_LETTER_SCREEN',
        }),
      )
    })

    it('should call navigations navigate for Proof of Creditable Prescription Drug Coverage Letter', async () => {
      initializeTestInstance(lettersData)
      await waitFor(() =>
        fireEvent.press(screen.getByRole('link', { name: 'Proof of creditable prescription drug coverage letter' })),
      )
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('GenericLetter', {
          description: t('letters.proofOfCrediblePrescription.description'),
          header: 'Proof of creditable prescription drug coverage letter',
          letterType: 'medicare_partd',
          screenID: 'PROOF_OF_CREDIBLE_PRESCRIPTION_LETTER_SCREEN',
        }),
      )
    })

    it('should call navigations navigate for Proof of Minimum Essential Coverage Letter', async () => {
      initializeTestInstance(lettersData)
      await waitFor(() =>
        fireEvent.press(screen.getByRole('link', { name: 'Proof of minimum essential coverage letter' })),
      )
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('GenericLetter', {
          description: t('letters.minimumEssentialCoverage.description'),
          descriptionA11yLabel: t('letters.minimumEssentialCoverageA11yLabel.description'),
          header: 'Proof of minimum essential coverage letter',
          letterType: 'minimum_essential_coverage',
          screenID: 'PROOF_OF_MINIMUM_ESSENTIAL_COVERAGE_LETTER_SCREEN',
        }),
      )
    })

    it('should call navigations navigate for Proof of Service Letter', async () => {
      initializeTestInstance(lettersData)
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: 'Proof of service card' })))
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('GenericLetter', {
          description: t('letters.proofOfService.description'),
          header: t('letters.proofOfServiceCard'),
          letterType: 'proof_of_service',
          screenID: 'PROOF_OF_SERVICE_LETTER_SCREEN',
        }),
      )
    })

    it('should call navigations navigate for Service Verification Letter', async () => {
      initializeTestInstance(lettersData)
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: 'Service verification letter' })))
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('GenericLetter', {
          description: t('letters.serviceVerificationLetter.description'),
          header: 'Service verification letter',
          letterType: 'service_verification',
          screenID: 'SERVICE_VERIFICATION_LETTER_SCREEN',
        }),
      )
    })
  })

  describe('when letters is falsy', () => {
    it('should show No Letters Screen', async () => {
      initializeTestInstance(null)
      await waitFor(() => expect(screen.getByText(t('noLetters.header'))).toBeTruthy())
    })
  })

  describe('when there is no letters', () => {
    it('should show No Letters Screen', async () => {
      initializeTestInstance([])
      await waitFor(() => expect(screen.getByText(t('noLetters.header'))).toBeTruthy())
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      initializeTestInstance([], true)
      await waitFor(() => expect(screen.getByText(t('errors.networkConnection.header'))).toBeTruthy())
    })
  })
})
