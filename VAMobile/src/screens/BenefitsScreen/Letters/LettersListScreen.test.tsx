import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { context, mockNavProps, waitFor, render } from 'testUtils'
import { initialLettersState, InitialState } from 'store/slices'
import { APIError, LettersList } from 'store/api/types'
import { LettersListScreen } from './index'
import { when } from 'jest-when'
import * as api from 'store/api'

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

jest.mock('../../../api/authorizedServices/getAuthorizedServices', () => {
  let original = jest.requireActual('../../../api/authorizedServices/getAuthorizedServices')
  return {
    ...original,
    useAuthorizedServices: jest.fn().mockReturnValue({
      status: "success",
      data: {
        appeals: true,
        appointments: true,
        claims: true,
        decisionLetters: true,
        directDepositBenefits: true,
        directDepositBenefitsUpdate: true,
        disabilityRating: true,
        genderIdentity: true,
        lettersAndDocuments: true,
        militaryServiceHistory: true,
        paymentHistory: true,
        preferredName: true,
        prescriptions: true,
        scheduleAppointments: true,
        secureMessaging: true,
        userProfileUpdate: true
      }
    }).mockReturnValueOnce({
      status: "success",
      data: {
        appeals: true,
        appointments: true,
        claims: true,
        decisionLetters: true,
        directDepositBenefits: true,
        directDepositBenefitsUpdate: true,
        disabilityRating: true,
        genderIdentity: true,
        lettersAndDocuments: false,
        militaryServiceHistory: true,
        paymentHistory: true,
        preferredName: true,
        prescriptions: true,
        scheduleAppointments: true,
        secureMessaging: true,
        userProfileUpdate: true
      }
    })
  }
})

jest.mock('store/slices/', () => {
  let actual = jest.requireActual('store/slices')
  let letters = jest.requireActual('store/slices').initialLettersState
  return {
    ...actual,
    getLetters: jest.fn(() => {
      return {
        type: '',
        payload: {
          ...letters,
        },
      }
    }),
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
  const initializeTestInstance = (lettersList: LettersList | null, loading = false, throwError: boolean = false) => {

    if (throwError) {
      when(api.get as jest.Mock)
        .calledWith('/v0/letters')
        .mockRejectedValue({ networkError: true } as APIError)
    } else {
      when(api.get as jest.Mock)
        .calledWith('/v0/letters')
        .mockResolvedValue({ data: { attributes: { letters: lettersList } } })
    }

    const storeVals = {
      ...InitialState,
      letters: { ...initialLettersState, loading },
    }

    if (lettersList) {
      storeVals.letters.letters = lettersList
    }

    render(<LettersListScreen {...mockNavProps()} />, {
      preloadedState: {
        ...storeVals,
      },
    })
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when lettersAndDocuments is set to false', () => {
    it('should show noLettersScreen', () => {
      initializeTestInstance(lettersData, false, false)
      expect(screen.getByText("We couldn't find information about your VA letters")).toBeTruthy()
    })
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', () => {
      initializeTestInstance(lettersData, true)
      expect(screen.getByText('Loading your letters list...')).toBeTruthy()
    })
  })

  it('should display the correct list of letters', async () => {
    await waitFor(() => {
      initializeTestInstance(lettersData)
    })
    expect(screen.getByRole('button', { name: 'Benefit summary letter' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Benefit verification letter'})).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Civil service preference letter'})).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Commissary letter'})).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Proof of creditable prescription drug coverage letter'})).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Proof of minimum essential coverage letter'})).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Proof of service card'})).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Service verification letter'})).toBeTruthy()
  })

  describe('when a link is clicked', () => {
    it('should call navigations navigate for Benefit Summary Service Verification Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })
      fireEvent.press(screen.getByRole('button', { name: 'Benefit summary letter'}))
      expect(mockNavigationSpy).toHaveBeenCalledWith('BenefitSummaryServiceVerificationLetter')
    })

    it('should call navigations navigate for Benefit Verification Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })
      fireEvent.press(screen.getByRole('button', { name: 'Benefit verification letter'}))
      expect(mockNavigationSpy).toHaveBeenCalledWith('GenericLetter', { description: "This letter shows the benefits you’re receiving from VA. The letter also shows your benefit gross amount (the amount before anything is taken out) and net amount (the amount after deductions are taken out), your benefit effective date, and your disability rating.", descriptionA11yLabel: "This letter shows the benefits you’re receiving from  V-A . The letter also shows your benefit gross amount (the amount before anything is taken out) and net amount (the amount after deductions are taken out), your benefit effective date, and your disability rating.", header: "Benefit verification letter", letterType: "benefit_verification", screenID: "BENEFIT_VERIFICATION_LETTER_SCREEN" })
    })

    it('should call navigations navigate for Civil Service Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })
      fireEvent.press(screen.getByRole('button', { name: 'Civil service preference letter'}))
      expect(mockNavigationSpy).toHaveBeenCalledWith('GenericLetter', { description: "This letter shows that you’re a disabled Veteran and you qualify for preference for civil service jobs.", header: "Civil service preference letter", letterType: "civil_service", screenID: "CIVIL_SERVICE_LETTER_SCREEN" })
    })

    it('should call navigations navigate for Commissary Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })
      fireEvent.press(screen.getByRole('button', { name: 'Commissary letter'}))
      expect(mockNavigationSpy).toHaveBeenCalledWith('GenericLetter', { description: "If you’re a Veteran with a 100% service-connected disability rating take this letter, a copy of your DD214 or other discharge papers, and your DD2765 to a local military ID and pass office. You can schedule an appointment to get a Retiree Military ID card at the office or use the Rapid Appointments Scheduler. The Retiree Military ID card gives you access to your local base facilities, including the commissary and post exchange.", header: "Commissary letter", letterType: "commissary", screenID: "COMMISSARY_LETTER_SCREEN" })
    })

    it('should call navigations navigate for Proof of Creditable Prescription Drug Coverage Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })
      fireEvent.press(screen.getByRole('button', { name: 'Proof of creditable prescription drug coverage letter'}))
      expect(mockNavigationSpy).toHaveBeenCalledWith('GenericLetter', { description: "You will need this letter as proof that you qualify for Medicare Part D prescription drug coverage.", header: "Proof of creditable prescription drug coverage letter", letterType: "medicare_partd", screenID: "PROOF_OF_CREDIBLE_PRESCRIPTION_LETTER_SCREEN" })
    })

    it('should call navigations navigate for Proof of Minimum Essential Coverage Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })
      fireEvent.press(screen.getByRole('button', { name: 'Proof of minimum essential coverage letter'}))
      expect(mockNavigationSpy).toHaveBeenCalledWith('GenericLetter', { description: "This letter indicates that you have Minimum Essential Coverage (MEC) as provided by VA. MEC means that your health care plan meets the health insurance requirements under the Affordable Care Act (ACA). To prove that you’re enrolled in the VA health care system, you must have IRS Form 1095-B from VA to show what months you were covered by a VA health care plan.", descriptionA11yLabel: "This letter indicates that you have Minimum Essential Coverage (M-E-C) as provided by V-A . M-E-C means that your health care plan meets the health insurance requirements under the Affordable Care Act (A-C-A). To prove that you’re enrolled in the V-A health care system, you must have I-R-S Form 1095-B from V-A to show what months you were covered by a V-A health care plan.", header: "Proof of minimum essential coverage letter", letterType: "minimum_essential_coverage", screenID: "PROOF_OF_MINIMUM_ESSENTIAL_COVERAGE_LETTER_SCREEN" })
    })

    it('should call navigations navigate for Proof of Service Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })
      fireEvent.press(screen.getByRole('button', { name: 'Proof of service card'}))
      expect(mockNavigationSpy).toHaveBeenCalledWith('GenericLetter', { description: "This card shows that you served honorably in the Armed Forces. This card might be useful as proof of status to receive discounts at certain stores or restaurants.", header: "Proof of service card", letterType: "proof_of_service", screenID: "PROOF_OF_SERVICE_LETTER_SCREEN" })
    })

    it('should call navigations navigate for Service Verification Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })
      fireEvent.press(screen.getByRole('button', { name: 'Service verification letter'}))
      expect(mockNavigationSpy).toHaveBeenCalledWith('GenericLetter', { description: "This letter shows your branch of service, the date you started active duty, and the date you were discharged from active duty.", header: "Service verification letter", letterType: "service_verification", screenID: "SERVICE_VERIFICATION_LETTER_SCREEN" })
    })
  })

  describe('when letters is falsy', () => {
    it('should show No Letters Screen', async () => {
      await waitFor(() => {
        initializeTestInstance(null)
      })
      expect(screen.getByText("We couldn't find information about your VA letters")).toBeTruthy()
    })
  })

  describe('when there is no letters', () => {
    it('should show No Letters Screen', async () => {
      await waitFor(() => {
        initializeTestInstance([])
      })
      expect(screen.getByText("We couldn't find information about your VA letters")).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      await waitFor(() => {
        initializeTestInstance([], undefined, true)
      })
      expect(screen.getByText("The app can't be loaded.")).toBeTruthy()
    })
  })
})
