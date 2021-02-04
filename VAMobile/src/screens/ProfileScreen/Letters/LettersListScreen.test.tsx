import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import { ErrorsState, initialErrorsState, initialLettersState, InitialState } from 'store/reducers'
import {LettersList} from "store/api/types"
import {LettersListScreen} from "./index"
import {ErrorComponent, LoadingComponent, TextView} from 'components';
import NoLettersScreen from './NoLettersScreen'
import { Pressable } from 'react-native'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'

const lettersData: LettersList = [
  {
    name: 'Commissary Letter',
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
  let store: any
  let component: any
  let testInstance: ReactTestInstance
  let props: any
  let navigationSpy = jest.fn()

  const initializeTestInstance = (lettersList: LettersList | null, loading = false, errorsState: ErrorsState = initialErrorsState) => {
    const storeVals = {
      ...InitialState,
      letters: {...initialLettersState, loading},
      errors: errorsState
    }

    if (lettersList) {
      storeVals.letters.letters = lettersList
    }

    store = mockStore(storeVals)

    props = mockNavProps(undefined, { navigate: navigationSpy })

    act(() => {
      component = renderWithProviders(<LettersListScreen {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance(lettersData)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(lettersData,true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  it('should display the correct list of letters', async () => {
    const texts = testInstance.findAllByType(TextView)
    expect(texts.length).toBe(8)

    expect(texts[0].props.children).toBe('Commissary Letter')
    expect(texts[1].props.children).toBe('Proof of Service Letter')
    expect(texts[2].props.children).toBe('Proof of Creditable Prescription Drug Coverage Letter')
    expect(texts[3].props.children).toBe('Proof of Minimum Essential Coverage Letter')
    expect(texts[4].props.children).toBe('Service Verification Letter')
    expect(texts[5].props.children).toBe('Civil Service Preference Letter')
    expect(texts[6].props.children).toBe('Benefit Summary Letter')
    expect(texts[7].props.children).toBe('Benefit Verification Letter')
  })

  describe('when a link is clicked', () => {
    it('should call navigations navigate for Benefit Summary Service Verification Letter', async () => {
      testInstance.findAllByType(Pressable)[6].props.onPress()
      expect(navigationSpy).toHaveBeenCalled()
      expect(navigationSpy).toHaveBeenCalledWith('BenefitSummaryServiceVerificationLetter')
    })

    it('should call navigations navigate for Service Verification Letter', async () => {
      testInstance.findAllByType(Pressable)[4].props.onPress()
      expect(navigationSpy).toHaveBeenCalled()
      expect(navigationSpy).toHaveBeenCalledWith('ServiceVerificationLetter')
    })

    it('should call navigations navigate for Commissary Letter', async () => {
      const description = 'If you’re a Veteran with a 100% service-connected disability rating take this letter, a copy of your DD214 or other discharge papers, and your DD2765 to a local military ID and pass office. You can schedule an appointment to get a Retiree Military ID card at the office or use the Rapid Appointments Scheduler. The Retiree Military ID card gives you access to your local base facilities, including the commissary and post exchange.'

      testInstance.findAllByType(Pressable)[0].props.onPress()
      expect(navigationSpy).toHaveBeenCalled()
      expect(navigationSpy).toHaveBeenCalledWith('GenericLetter', { header: 'Commissary Letter', description, letterType: 'commissary', screenID: 'COMMISSARY_LETTER_SCREEN_ID' })
    })

    it('should call navigations navigate for Civil Service Letter', async () => {
      testInstance.findAllByType(Pressable)[5].props.onPress()
      expect(navigationSpy).toHaveBeenCalled()
      expect(navigationSpy).toHaveBeenCalledWith('GenericLetter', { header: 'Civil Service Preference Letter', description: 'This letter shows that you’re a disabled Veteran and you qualify for preference for civil service jobs.', letterType: 'civil_service', screenID: 'CIVIL_SERVICE_LETTER_SCREEN_ID' })
    })

    it('should call navigations navigate for Benefit Verification Letter', async () => {
      const description = 'This letter shows the benefits you’re receiving from VA. The letter also shows your benefit gross amount (the amount before anything is taken out) and net amount (the amount after deductions are taken out), your benefit effective date, and your disability rating.'

      testInstance.findAllByType(Pressable)[7].props.onPress()
      expect(navigationSpy).toHaveBeenCalled()
      expect(navigationSpy).toHaveBeenCalledWith('GenericLetter', { header: 'Benefit Verification Letter', description, letterType: 'benefit_verification', screenID: 'BENEFIT_VERIFICATION_SCREEN_ID' })
    })
  })

  describe('when letters is falsy', () => {
    it('should show No Letters Screen', async () => {
      initializeTestInstance(null)

      expect(testInstance.findByType(NoLettersScreen)).toBeTruthy()
    })
  })

  describe('when there is no letters', () => {
    it('should show No Letters Screen', async () => {
      initializeTestInstance([])

      expect(testInstance.findByType(NoLettersScreen)).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: ScreenIDTypesConstants.LETTERS_LIST_SCREEN_ID,
        errorType: CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance([], undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: undefined,
        errorType: CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance([], undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})
