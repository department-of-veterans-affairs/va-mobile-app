import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
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
    name: 'Benefit Summary Letter',
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
            genderIdentity: true,
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
      await waitFor(() => expect(screen.getByText("We couldn't find information about your VA letters")).toBeTruthy())
    })
  })

  it('should render correctly', async () => {
    initializeTestInstance(lettersData)
    expect(screen.getByText('Loading your letters list...')).toBeTruthy()
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Benefit summary letter' })).toBeTruthy())
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Benefit verification letter' })).toBeTruthy())
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Civil service preference letter' })).toBeTruthy())
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Commissary letter' })).toBeTruthy())
    await waitFor(() =>
      expect(
        screen.getByRole('menuitem', { name: 'Proof of creditable prescription drug coverage letter' }),
      ).toBeTruthy(),
    )
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Proof of minimum essential coverage letter' })).toBeTruthy(),
    )
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Proof of service card' })).toBeTruthy())
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Service verification letter' })).toBeTruthy())
  })

  describe('when a link is clicked', () => {
    it('should call navigations navigate for Benefit Summary Service Verification Letter', async () => {
      initializeTestInstance(lettersData)
      await waitFor(() => fireEvent.press(screen.getByRole('menuitem', { name: 'Benefit summary letter' })))
      await waitFor(() => expect(mockNavigationSpy).toHaveBeenCalledWith('BenefitSummaryServiceVerificationLetter'))
    })

    it('should call navigations navigate for Benefit Verification Letter', async () => {
      initializeTestInstance(lettersData)
      await waitFor(() => fireEvent.press(screen.getByRole('menuitem', { name: 'Benefit verification letter' })))
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('GenericLetter', {
          description:
            'This letter shows the benefits you’re receiving from VA. The letter also shows your benefit gross amount (the amount before anything is taken out) and net amount (the amount after deductions are taken out), your benefit effective date, and your disability rating.',
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
      await waitFor(() => fireEvent.press(screen.getByRole('menuitem', { name: 'Civil service preference letter' })))
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('GenericLetter', {
          description:
            'This letter shows that you’re a disabled Veteran and you qualify for preference for civil service jobs.',
          header: 'Civil service preference letter',
          letterType: 'civil_service',
          screenID: 'CIVIL_SERVICE_LETTER_SCREEN',
        }),
      )
    })

    it('should call navigations navigate for Commissary Letter', async () => {
      initializeTestInstance(lettersData)
      await waitFor(() => fireEvent.press(screen.getByRole('menuitem', { name: 'Commissary letter' })))
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('GenericLetter', {
          description:
            'If you’re a Veteran with a 100% service-connected disability rating take this letter, a copy of your DD214 or other discharge papers, and your DD2765 to a local military ID and pass office. You can schedule an appointment to get a Retiree Military ID card at the office or use the Rapid Appointments Scheduler. The Retiree Military ID card gives you access to your local base facilities, including the commissary and post exchange.',
          header: 'Commissary letter',
          letterType: 'commissary',
          screenID: 'COMMISSARY_LETTER_SCREEN',
        }),
      )
    })

    it('should call navigations navigate for Proof of Creditable Prescription Drug Coverage Letter', async () => {
      initializeTestInstance(lettersData)
      await waitFor(() =>
        fireEvent.press(
          screen.getByRole('menuitem', { name: 'Proof of creditable prescription drug coverage letter' }),
        ),
      )
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('GenericLetter', {
          description:
            'You will need this letter as proof that you qualify for Medicare Part D prescription drug coverage.',
          header: 'Proof of creditable prescription drug coverage letter',
          letterType: 'medicare_partd',
          screenID: 'PROOF_OF_CREDIBLE_PRESCRIPTION_LETTER_SCREEN',
        }),
      )
    })

    it('should call navigations navigate for Proof of Minimum Essential Coverage Letter', async () => {
      initializeTestInstance(lettersData)
      await waitFor(() =>
        fireEvent.press(screen.getByRole('menuitem', { name: 'Proof of minimum essential coverage letter' })),
      )
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('GenericLetter', {
          description:
            'This letter indicates that you have Minimum Essential Coverage (MEC) as provided by VA. MEC means that your health care plan meets the health insurance requirements under the Affordable Care Act (ACA). To prove that you’re enrolled in the VA health care system, you must have IRS Form 1095-B from VA to show what months you were covered by a VA health care plan.',
          descriptionA11yLabel:
            'This letter indicates that you have Minimum Essential Coverage (M-E-C) as provided by V-A . M-E-C means that your health care plan meets the health insurance requirements under the Affordable Care Act (A-C-A). To prove that you’re enrolled in the V-A health care system, you must have I-R-S Form 1095-B from V-A to show what months you were covered by a V-A health care plan.',
          header: 'Proof of minimum essential coverage letter',
          letterType: 'minimum_essential_coverage',
          screenID: 'PROOF_OF_MINIMUM_ESSENTIAL_COVERAGE_LETTER_SCREEN',
        }),
      )
    })

    it('should call navigations navigate for Proof of Service Letter', async () => {
      initializeTestInstance(lettersData)
      await waitFor(() => fireEvent.press(screen.getByRole('menuitem', { name: 'Proof of service card' })))
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('GenericLetter', {
          description:
            'This card shows that you served honorably in the Armed Forces. This card might be useful as proof of status to receive discounts at certain stores or restaurants.',
          header: 'Proof of service card',
          letterType: 'proof_of_service',
          screenID: 'PROOF_OF_SERVICE_LETTER_SCREEN',
        }),
      )
    })

    it('should call navigations navigate for Service Verification Letter', async () => {
      initializeTestInstance(lettersData)
      await waitFor(() => fireEvent.press(screen.getByRole('menuitem', { name: 'Service verification letter' })))
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('GenericLetter', {
          description:
            'This letter shows your branch of service, the date you started active duty, and the date you were discharged from active duty.',
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
      await waitFor(() => expect(screen.getByText("We couldn't find information about your VA letters")).toBeTruthy())
    })
  })

  describe('when there is no letters', () => {
    it('should show No Letters Screen', async () => {
      initializeTestInstance([])
      await waitFor(() => expect(screen.getByText("We couldn't find information about your VA letters")).toBeTruthy())
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      initializeTestInstance([], true)
      await waitFor(() => expect(screen.getByText("The app can't be loaded.")).toBeTruthy())
    })
  })
})
