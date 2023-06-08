import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'

import { context, mockNavProps, render, RenderAPI } from 'testUtils'
import { ErrorsState, initialAuthState, initialErrorsState, initializeErrorsByScreenID } from 'store/slices'
import { LoadingComponent, TextView, ErrorComponent } from 'components'
import DisabilityRatingsScreen from './DisabilityRatingsScreen'
import { CommonErrorTypesConstants } from 'constants/errors'
import { RatingData, ScreenIDTypesConstants } from 'store/api/types'
import NoDisabilityRatings from './NoDisabilityRatings/NoDisabilityRatings'

let mockNavigationSpy = jest.fn()

jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => {
      return () => mockNavigationSpy
    },
  }
})

context('DisabilityRatingsScreen', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance

  const ratingDataMock = {
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

  const initializeTestInstance = (ratingInfo = ratingDataMock, loading = false, errorState: ErrorsState = initialErrorsState) => {
    props = mockNavProps()

    component = render(<DisabilityRatingsScreen {...props} />, {
      preloadedState: {
        auth: { ...initialAuthState },
        disabilityRating: {
          ratingData: ratingInfo,
          loading,
          needsDataLoad: false,
          preloadComplete: true,
        },
        errors: errorState,
      },
    })

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()

    const headers = testInstance.findAllByProps({ accessibilityRole: 'header' })
    expect(headers[6].props.children).toBe('Combined disability rating')
    expect(headers[15].props.children).toBe('Individual ratings')
    expect(headers[22].props.children).toBe('Learn about VA disability ratings')
    expect(headers[30].props.children).toBe('Need Help?')

    const texts = testInstance.findAllByType(TextView)
    expect(texts[4].props.children).toBe('70%')
    expect(texts[5].props.children).toBe(
      "This rating doesn't include any disabilities for your claims that are still in process. You can check the status of your disability claims or appeals with the Claim Status tool.",
    )

    expect(texts[7].props.children).toBe('50%')
    expect(texts[8].props.children).toBe('PTSD')
    expect(texts[9].props.children).toBe('Service-connected disability?  Yes')
    expect(texts[10].props.children).toBe('Effective date:  12/01/2012')

    expect(texts[11].props.children).toBe('30%')
    expect(texts[12].props.children).toBe('Headaches, migraine')
    expect(texts[13].props.children).toBe('Service-connected disability?  Yes')
    expect(texts[14].props.children).toBe('Effective date:  08/09/2013')

    const links = testInstance.findAllByProps({ accessibilityRole: 'link' })
    expect(links[0].findByType(TextView).props.children).toBe('About VA disability ratings')
    expect(links[5].findByType(TextView).props.children).toBe('800-827-1000')
    expect(links[10].findByType(TextView).props.children).toBe('TTY: 711')
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(ratingDataMock, true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  describe('when there is disability ratings', () => {
    it('should render NoInboxMessages', async () => {
      expect(testInstance.findAllByType(NoDisabilityRatings)).toHaveLength(0)
    })
  })

  describe('when there is no disability ratings', () => {
    it('should render NoInboxMessages', async () => {
      initializeTestInstance({} as RatingData)
      expect(testInstance.findAllByType(NoDisabilityRatings)).toBeTruthy()
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

      initializeTestInstance(ratingDataMock, undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })
  })
})
