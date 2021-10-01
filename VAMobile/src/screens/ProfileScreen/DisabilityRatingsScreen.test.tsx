import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'
import { ErrorsState, initialAuthState, initialErrorsState, initializeErrorsByScreenID } from 'store/reducers'
import { LoadingComponent, TextView, CallHelpCenter } from 'components'
import ProfileBanner from './ProfileBanner'
import DisabilityRatingsScreen from './DisabilityRatingsScreen'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types'
import { Pressable } from 'react-native'

let mockNavigationSpy = jest.fn()

jest.mock('../../utils/hooks', () => {
  let original = jest.requireActual('../../utils/hooks')
  let theme = jest.requireActual('../../styles/themes/standardTheme').default

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

context('DisabilityRatingsScreen', () => {
  let store: any
  let component: any
  let props: any
  let testInstance: ReactTestInstance

  const ratingData = {
    combinedDisabilityRating: 70,
    combinedEffectiveDate: '2013-08-09T00:00:00.000+00:00',
    legalEffectiveDate: '2013-08-09T00:00:00.000+00:00',
    individualRatings: [
      {
        decision: 'Service Connected',
        effectiveDate: '2012-12-01T00:00:00.000+00:00',
        ratingPercentage: 50,
        diagnosticText: 'PTSD',
        type: 'Post traumatic stress disorder',
      },
      {
        decision: 'Service Connected',
        effectiveDate: '2013-08-09T00:00:00.000+00:00',
        ratingPercentage: 30,
        diagnosticText: 'headaches, migraine',
        type: 'Migraine',
      },
    ],
  }

  const initializeTestInstance = (loading = false, errorState: ErrorsState = initialErrorsState) => {
    store = mockStore({
      auth: { ...initialAuthState },
      disabilityRating: {
        ratingData,
        loading,
        needsDataLoad: false,
        preloadComplete: true,
      },
      errors: errorState,
    })

    props = mockNavProps()

    act(() => {
      component = renderWithProviders(<DisabilityRatingsScreen {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()

    const profileBanner = testInstance.findAllByType(ProfileBanner)
    expect(profileBanner).toBeTruthy()

    const headers = testInstance.findAllByProps({ accessibilityRole: 'header' })
    expect(headers[5].props.children).toBe('Combined disability rating')
    expect(headers[15].props.children).toBe('Individual ratings')
    expect(headers[20].props.children).toBe('Learn about VA disability ratings')
    expect(headers[30].props.children).toBe('Need Help?')

    const texts = testInstance.findAllByType(TextView)
    expect(texts[2].props.children).toBe('70%')
    expect(texts[3].props.children).toBe(
      "This rating doesn't include any disabilities for your claims that are still in process. You can check the status of your disability claims or appeals with the Claim Status tool.",
    )

    expect(texts[5].props.children).toBe('50%')
    expect(texts[6].props.children).toBe('PTSD')
    expect(texts[7].props.children).toBe('Service-connected disability?  Yes')
    expect(texts[8].props.children).toBe('Effective date:  12/01/2012')

    expect(texts[9].props.children).toBe('30%')
    expect(texts[10].props.children).toBe('Headaches, migraine')
    expect(texts[11].props.children).toBe('Service-connected disability?  Yes')
    expect(texts[12].props.children).toBe('Effective date:  08/09/2013')

    const links = testInstance.findAllByProps({ accessibilityRole: 'link' })
    expect(links[0].findByType(TextView).props.children).toBe('About VA disability ratings')
    expect(links[5].findByType(TextView).props.children).toBe('800-827-1000')
    expect(links[10].findByType(TextView).props.children).toBe('711')
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  describe('when there is an error', () => {
    it('should show an error screen', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.DISABILITY_RATING_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      initializeTestInstance(undefined, errorState)
      expect(testInstance.findAllByType(CallHelpCenter)).toHaveLength(1)
    })
  })
})
