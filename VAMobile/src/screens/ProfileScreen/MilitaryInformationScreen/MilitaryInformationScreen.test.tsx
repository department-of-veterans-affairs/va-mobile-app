import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import { context, mockStore, renderWithProviders } from 'testUtils'

import { ErrorComponent, LoadingComponent, TextView } from 'components'
import ProfileBanner from '../ProfileBanner'
import MilitaryInformationScreen from './index'
import { ErrorsState, initialAuthState, initialErrorsState } from 'store/reducers'
import {BranchesOfServiceConstants} from 'store/api/types'
import { CommonErrors } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'

context('MilitaryInformationScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance
  const serviceHistory = [{
    branchOfService: BranchesOfServiceConstants.MarineCorps,
    beginDate: '1993-06-04',
    endDate: '1995-07-10',
    formattedBeginDate: 'June 04, 1993',
    formattedEndDate: 'July 10, 1995',
  }]

  const initializeTestInstance = (loading = false, errorsState: ErrorsState = initialErrorsState) => {
    store = mockStore({
      auth: {...initialAuthState},
      militaryService: { loading, serviceHistory },
      errors: errorsState
    })

    act(() => {
      component = renderWithProviders(<MilitaryInformationScreen />, store)
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

    const header = testInstance.findByProps({accessibilityRole: 'header'})
    expect(header.props.children).toBe('Period of service')

    const texts = testInstance.findAllByType(TextView)
    expect(texts[3].props.children).toBe('United States Marine Corps')
    expect(texts[4].props.children).toBe('June 04, 1993 - July 10, 1995')

    const link = testInstance.findByProps({accessibilityRole: 'link'})
    expect(link.props.children).toBe('What if my military service information doesn\'t look right?')
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID,
        errorType: CommonErrors.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(true, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: undefined,
        errorType: CommonErrors.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(true, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})
