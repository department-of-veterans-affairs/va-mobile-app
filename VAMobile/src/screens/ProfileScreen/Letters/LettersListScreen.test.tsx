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

let mockNavigationSpy = jest.fn()
  jest.mock('../../../utils/hooks', () => {
  let original = jest.requireActual("../../../utils/hooks")
  let theme = jest.requireActual("../../../styles/themes/standardTheme").default
  return {
    ...original,
    useTheme: jest.fn(()=> {
      return {...theme}
    }),
    useRouteNavigation: () => { return () => mockNavigationSpy },
  }
})

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

    props = mockNavProps()

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
    expect(texts[1].props.children).toBe('Proof of Service Card')
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
      expect(mockNavigationSpy).toHaveBeenCalled()
    })

    it('should call navigations navigate for Service Verification Letter', async () => {
      testInstance.findAllByType(Pressable)[4].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })

    it('should call navigations navigate for Commissary Letter', async () => {
      testInstance.findAllByType(Pressable)[0].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })

    it('should call navigations navigate for Civil Service Letter', async () => {
      testInstance.findAllByType(Pressable)[5].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })

    it('should call navigations navigate for Benefit Verification Letter', async () => {
      testInstance.findAllByType(Pressable)[7].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })

    it('should call navigations navigate for Proof of Service Letter', async () => {
      testInstance.findAllByType(Pressable)[1].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })

    it('should call navigations navigate for Proof of Creditable Prescription Drug Coverage Letter', async () => {
      testInstance.findAllByType(Pressable)[2].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })

    it('should call navigations navigate for Proof of Minimum Essential Coverage Letter', async () => {
      testInstance.findAllByType(Pressable)[3].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
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
