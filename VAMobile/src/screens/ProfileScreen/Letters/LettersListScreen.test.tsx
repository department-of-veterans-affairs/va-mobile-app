import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, mockStore, renderWithProviders } from 'testUtils'
import {initialLettersState, InitialState} from 'store/reducers'
import {LettersList} from "store/api/types"
import {LettersListScreen} from "./index"
import { LoadingComponent, TextView } from 'components';
import NoLettersScreen from './NoLettersScreen'
import { Pressable } from 'react-native'

let mockNavigationSpy = jest.fn()
jest.mock('../../../utils/hooks', () => {
  let original = jest.requireActual("../../../utils/hooks")
  let theme = jest.requireActual("../../../styles/themes/standardTheme").default
  return {
    ...original,
    useTheme: jest.fn(()=> {
      return {...theme}
    }),
    useRouteNavigation: () => { return () => mockNavigationSpy},
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

  const initializeTestInstance = (lettersList: LettersList, loading = false) => {
    store = mockStore({
      ...InitialState,
      letters: {...initialLettersState, letters: lettersList, loading}
    })

    act(() => {
      component = renderWithProviders(<LettersListScreen/>, store)
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
    it('should call useRouteNavigation for BenefitSummaryServiceVerificationLetter', async () => {
      testInstance.findAllByType(Pressable)[6].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })

    it('should call useRouteNavigation for ServiceVerificationLetter', async () => {
      testInstance.findAllByType(Pressable)[4].props.onPress()
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
})
