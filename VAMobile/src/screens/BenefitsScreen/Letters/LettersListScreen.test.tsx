import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, mockNavProps, waitFor, render, RenderAPI } from 'testUtils'
import { ErrorsState, initialErrorsState, initializeErrorsByScreenID, initialLettersState, InitialState } from 'store/slices'
import { APIError, LettersList } from 'store/api/types'
import { LettersListScreen } from './index'
import { ErrorComponent, LoadingComponent, TextView } from 'components'
import NoLettersScreen from './NoLettersScreen'
import { Pressable } from 'react-native'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
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
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any
  let mockNavigateToBenefitSummarySpy: jest.Mock
  let mockNavigateToServiceVerificationLetterSpy: jest.Mock
  let mockNavigateToCommissaryLetterSpy: jest.Mock
  let mockNavigateToCivilServiceLetterSpy: jest.Mock
  let mockNavigateToBenefitVerificationSpy: jest.Mock
  let mockNavigateToProofOfServiceLetterSpy: jest.Mock
  let mockNavigateToProofOfPrescriptionLetterSpy: jest.Mock
  let mockNavigateToProofOfMinimumEssentialLetterSpy: jest.Mock

  const initializeTestInstance = (lettersList: LettersList | null, loading = false, throwError: boolean = false, lettersAndDocuments: boolean = true) => {
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

    component = render(<LettersListScreen {...props} />, {
      preloadedState: {
        ...storeVals,
      },
    })

    testInstance = component.UNSAFE_root
  }

  describe('when lettersAndDocuments is set to false', () => {
    it('should show noLettersScreen', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData, false, false, false)
        expect(testInstance.findByType(NoLettersScreen)).toBeTruthy()
      })
    })
  })

  it('initializes correctly', async () => {
    await waitFor(() => {
      initializeTestInstance(lettersData)
      expect(component).toBeTruthy()
    })
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData, true)
        expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
      })
    })
  })

  it('should display the correct list of letters', async () => {
    await waitFor(() => {
      initializeTestInstance(lettersData)
    })

    const texts = testInstance.findAllByType(TextView)
    expect(texts.length).toBe(11)

    expect(texts[3].props.children).toBe('Benefit summary letter')
    expect(texts[4].props.children).toBe('Benefit verification letter')
    expect(texts[5].props.children).toBe('Civil service preference letter')
    expect(texts[6].props.children).toBe('Commissary letter')
    expect(texts[7].props.children).toBe('Proof of creditable prescription drug coverage letter')
    expect(texts[8].props.children).toBe('Proof of minimum essential coverage letter')
    expect(texts[9].props.children).toBe('Proof of service card')
    expect(texts[10].props.children).toBe('Service verification letter')
  })

  describe('when a link is clicked', () => {
    it('should call navigations navigate for Benefit Summary Service Verification Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })

      await waitFor(() => {
        testInstance.findAllByType(Pressable)[0].props.onPress()
      })

      expect(mockNavigateToBenefitSummarySpy).toHaveBeenCalled()
    })

    it('should call navigations navigate for Benefit Verification Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })

      await waitFor(() => {
        testInstance.findAllByType(Pressable)[1].props.onPress()
      })

      expect(mockNavigateToBenefitVerificationSpy).toHaveBeenCalled()
    })

    it('should call navigations navigate for Civil Service Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })

      await waitFor(() => {
        testInstance.findAllByType(Pressable)[2].props.onPress()
      })

      expect(mockNavigateToCivilServiceLetterSpy).toHaveBeenCalled()
    })

    it('should call navigations navigate for Commissary Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })

      await waitFor(() => {
        testInstance.findAllByType(Pressable)[3].props.onPress()
      })

      expect(mockNavigateToCommissaryLetterSpy).toHaveBeenCalled()
    })

    it('should call navigations navigate for Proof of Creditable Prescription Drug Coverage Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })

      await waitFor(() => {
        testInstance.findAllByType(Pressable)[4].props.onPress()
      })

      expect(mockNavigateToProofOfPrescriptionLetterSpy).toHaveBeenCalled()
    })

    it('should call navigations navigate for Proof of Minimum Essential Coverage Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })

      await waitFor(() => {
        testInstance.findAllByType(Pressable)[5].props.onPress()
      })

      expect(mockNavigateToProofOfMinimumEssentialLetterSpy).toHaveBeenCalled()
    })

    it('should call navigations navigate for Proof of Service Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })

      await waitFor(() => {
        testInstance.findAllByType(Pressable)[6].props.onPress()
      })

      expect(mockNavigateToProofOfServiceLetterSpy).toHaveBeenCalled()
    })

    it('should call navigations navigate for Service Verification Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
      })

      await waitFor(() => {
        testInstance.findAllByType(Pressable)[7].props.onPress()
      })

      expect(mockNavigateToServiceVerificationLetterSpy).toHaveBeenCalled()
    })
  })

  describe('when letters is falsy', () => {
    it('should show No Letters Screen', async () => {
      await waitFor(() => {
        initializeTestInstance(null)
      })

      expect(testInstance.findByType(NoLettersScreen)).toBeTruthy()
    })
  })

  describe('when there is no letters', () => {
    it('should show No Letters Screen', async () => {
      await waitFor(() => {
        initializeTestInstance([])
      })

      expect(testInstance.findByType(NoLettersScreen)).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      await waitFor(() => {
        initializeTestInstance([], undefined, true)
      })

      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      await waitFor(() => {
        initializeTestInstance([], undefined, false)
        expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
      })
    })
  })
})
