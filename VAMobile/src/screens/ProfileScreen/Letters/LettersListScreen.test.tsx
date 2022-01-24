import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, mockNavProps, waitFor, render, RenderAPI } from 'testUtils'
import { ErrorsState, initialAuthorizedServicesState, initialErrorsState, initializeErrorsByScreenID, initialLettersState, InitialState } from 'store/slices'
import { LettersList } from 'store/api/types'
import { LettersListScreen } from './index'
import { ErrorComponent, LoadingComponent, TextView } from 'components'
import NoLettersScreen from './NoLettersScreen'
import { Pressable } from 'react-native'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'

let mockNavigationSpy = jest.fn()

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
  let theme = jest.requireActual('styles/themes/standardTheme').default
  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
    useRouteNavigation: () => {
      return () => mockNavigationSpy
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

  const initializeTestInstance = (lettersList: LettersList | null, loading = false, errorsState: ErrorsState = initialErrorsState, lettersAndDocuments: boolean = true) => {
    const storeVals = {
      ...InitialState,
      authorizedServices: {
        ...initialAuthorizedServicesState,
        lettersAndDocuments: lettersAndDocuments,
      },
      letters: { ...initialLettersState, loading },
      errors: errorsState,
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

    testInstance = component.container
  }

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
      const texts = testInstance.findAllByType(TextView)
      expect(texts.length).toBe(8)

      expect(texts[0].props.children).toBe('Commissary letter')
      expect(texts[1].props.children).toBe('Proof of service card')
      expect(texts[2].props.children).toBe('Proof of creditable prescription drug coverage letter')
      expect(texts[3].props.children).toBe('Proof of minimum essential coverage letter')
      expect(texts[4].props.children).toBe('Service verification letter')
      expect(texts[5].props.children).toBe('Civil service preference letter')
      expect(texts[6].props.children).toBe('Benefit summary letter')
      expect(texts[7].props.children).toBe('Benefit verification letter')
    })
  })

  describe('when a link is clicked', () => {
    it('should call navigations navigate for Benefit Summary Service Verification Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
        testInstance.findAllByType(Pressable)[6].props.onPress()
        expect(mockNavigationSpy).toHaveBeenCalled()
      })
    })

    it('should call navigations navigate for Service Verification Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
        testInstance.findAllByType(Pressable)[4].props.onPress()
        expect(mockNavigationSpy).toHaveBeenCalled()
      })
    })

    it('should call navigations navigate for Commissary Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
        testInstance.findAllByType(Pressable)[0].props.onPress()
        expect(mockNavigationSpy).toHaveBeenCalled()
      })
    })

    it('should call navigations navigate for Civil Service Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
        testInstance.findAllByType(Pressable)[5].props.onPress()
        expect(mockNavigationSpy).toHaveBeenCalled()
      })
    })

    it('should call navigations navigate for Benefit Verification Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
        testInstance.findAllByType(Pressable)[7].props.onPress()
        expect(mockNavigationSpy).toHaveBeenCalled()
      })
    })

    it('should call navigations navigate for Proof of Service Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
        testInstance.findAllByType(Pressable)[1].props.onPress()
        expect(mockNavigationSpy).toHaveBeenCalled()
      })
    })

    it('should call navigations navigate for Proof of Creditable Prescription Drug Coverage Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
        testInstance.findAllByType(Pressable)[2].props.onPress()
        expect(mockNavigationSpy).toHaveBeenCalled()
      })
    })

    it('should call navigations navigate for Proof of Minimum Essential Coverage Letter', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData)
        testInstance.findAllByType(Pressable)[3].props.onPress()
        expect(mockNavigationSpy).toHaveBeenCalled()
      })
    })
  })

  describe('when lettersAndDocuments is set to false', () => {
    it('should show noLettersScreen', async () => {
      await waitFor(() => {
        initializeTestInstance(lettersData, false, initialErrorsState, false)
        expect(testInstance.findByType(NoLettersScreen)).toBeTruthy()
      })
    })
  })

  describe('when letters is falsy', () => {
    it('should show No Letters Screen', async () => {
      await waitFor(() => {
        initializeTestInstance(null)
        expect(testInstance.findByType(NoLettersScreen)).toBeTruthy()
      })
    })
  })

  describe('when there is no letters', () => {
    it('should show No Letters Screen', async () => {
      await waitFor(() => {
        initializeTestInstance([])
        expect(testInstance.findByType(NoLettersScreen)).toBeTruthy()
      })
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.LETTERS_LIST_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }
      await waitFor(() => {
        initializeTestInstance([], undefined, errorState)
        expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
      })
    })

    it('should not render error component when the stores screenID does not match the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      await waitFor(() => {
        initializeTestInstance([], undefined, errorState)
        expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
      })
    })
  })
})
