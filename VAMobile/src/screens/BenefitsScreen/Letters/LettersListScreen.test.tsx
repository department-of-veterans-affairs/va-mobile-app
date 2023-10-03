import 'react-native'
import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { context, mockNavProps, waitFor, render } from 'testUtils'
import { initialLettersState, InitialState } from 'store/slices'
import { APIError, LettersList } from 'store/api/types'
import { LettersListScreen } from './index'
import { when } from 'jest-when'
import * as api from 'store/api'

let mockNavigationSpy = jest.fn()

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
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
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
  let props: any
  let mockNavigateToBenefitSummarySpy: jest.Mock
  let mockNavigateToServiceVerificationLetterSpy: jest.Mock
  let mockNavigateToCommissaryLetterSpy: jest.Mock
  let mockNavigateToCivilServiceLetterSpy: jest.Mock
  let mockNavigateToBenefitVerificationSpy: jest.Mock
  let mockNavigateToProofOfServiceLetterSpy: jest.Mock
  let mockNavigateToProofOfPrescriptionLetterSpy: jest.Mock
  let mockNavigateToProofOfMinimumEssentialLetterSpy: jest.Mock

  const initializeTestInstance = (lettersList: LettersList | null, loading = false, throwError: boolean = false) => {
    mockNavigateToBenefitSummarySpy = jest.fn()
    mockNavigateToServiceVerificationLetterSpy = jest.fn()
    mockNavigateToCommissaryLetterSpy = jest.fn()
    mockNavigateToCivilServiceLetterSpy = jest.fn()
    mockNavigateToBenefitVerificationSpy = jest.fn()
    mockNavigateToProofOfServiceLetterSpy = jest.fn()
    mockNavigateToProofOfPrescriptionLetterSpy = jest.fn()
    mockNavigateToProofOfMinimumEssentialLetterSpy = jest.fn()
    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('BenefitSummaryServiceVerificationLetter')
      .mockReturnValue(mockNavigateToBenefitSummarySpy)
      .calledWith('GenericLetter', expect.objectContaining({ letterType: 'service_verification' }))
      .mockReturnValue(mockNavigateToServiceVerificationLetterSpy)
      .calledWith('GenericLetter', expect.objectContaining({ letterType: 'commissary' }))
      .mockReturnValue(mockNavigateToCommissaryLetterSpy)
      .calledWith('GenericLetter', expect.objectContaining({ letterType: 'civil_service' }))
      .mockReturnValue(mockNavigateToCivilServiceLetterSpy)
      .calledWith('GenericLetter', expect.objectContaining({ letterType: 'benefit_verification' }))
      .mockReturnValue(mockNavigateToBenefitVerificationSpy)
      .calledWith('GenericLetter', expect.objectContaining({ letterType: 'proof_of_service' }))
      .mockReturnValue(mockNavigateToProofOfServiceLetterSpy)
      .calledWith('GenericLetter', expect.objectContaining({ letterType: 'medicare_partd' }))
      .mockReturnValue(mockNavigateToProofOfPrescriptionLetterSpy)
      .calledWith('GenericLetter', expect.objectContaining({ letterType: 'minimum_essential_coverage' }))
      .mockReturnValue(mockNavigateToProofOfMinimumEssentialLetterSpy)

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

    props = mockNavProps()

    render(<LettersListScreen {...props} />, {
      preloadedState: {
        ...storeVals,
      },
    })
  }

  describe('when lettersAndDocuments is set to false', () => {
    it('should show noLettersScreen', async () => {
      initializeTestInstance(lettersData, false, false)
      expect(screen.getByText("We couldn't find information about your VA letters")).toBeTruthy()
    })
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(lettersData, true)
      expect(screen.getByText('Loading your letters list...')).toBeTruthy()
    })
  })

  it('should display the correct list of letters', async () => {
    await waitFor(() => {
      initializeTestInstance(lettersData)
    })
    expect(screen.getByText('Benefit summary letter')).toBeTruthy()
    expect(screen.getByText('Benefit verification letter')).toBeTruthy()
    expect(screen.getByText('Civil service preference letter')).toBeTruthy()
    expect(screen.getByText('Commissary letter')).toBeTruthy()
    expect(screen.getByText('Proof of creditable prescription drug coverage letter')).toBeTruthy()
    expect(screen.getByText('Proof of minimum essential coverage letter')).toBeTruthy()
    expect(screen.getByText('Proof of service card')).toBeTruthy()
    expect(screen.getByText('Service verification letter')).toBeTruthy()
  })

  describe('when a link is clicked', () => {
    it('should call navigations navigate for Benefit Summary Service Verification Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })
      fireEvent.press(screen.getByText('Benefit summary letter'))
      expect(mockNavigateToBenefitSummarySpy).toHaveBeenCalled()
    })

    it('should call navigations navigate for Benefit Verification Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })
      fireEvent.press(screen.getByText('Benefit verification letter'))
      expect(mockNavigateToBenefitVerificationSpy).toHaveBeenCalled()
    })

    it('should call navigations navigate for Civil Service Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })
      fireEvent.press(screen.getByText('Civil service preference letter'))
      expect(mockNavigateToCivilServiceLetterSpy).toHaveBeenCalled()
    })

    it('should call navigations navigate for Commissary Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })
      fireEvent.press(screen.getByText('Commissary letter'))
      expect(mockNavigateToCommissaryLetterSpy).toHaveBeenCalled()
    })

    it('should call navigations navigate for Proof of Creditable Prescription Drug Coverage Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })
      fireEvent.press(screen.getByText('Proof of creditable prescription drug coverage letter'))
      expect(mockNavigateToProofOfPrescriptionLetterSpy).toHaveBeenCalled()
    })

    it('should call navigations navigate for Proof of Minimum Essential Coverage Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })
      fireEvent.press(screen.getByText('Proof of minimum essential coverage letter'))
      expect(mockNavigateToProofOfMinimumEssentialLetterSpy).toHaveBeenCalled()
    })

    it('should call navigations navigate for Proof of Service Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })
      fireEvent.press(screen.getByText('Proof of service card'))
      expect(mockNavigateToProofOfServiceLetterSpy).toHaveBeenCalled()
    })

    it('should call navigations navigate for Service Verification Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })
      fireEvent.press(screen.getByText('Service verification letter'))
      expect(mockNavigateToServiceVerificationLetterSpy).toHaveBeenCalled()
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
