import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, render, RenderAPI } from 'testUtils'

import { Pressable } from 'react-native'
import { LettersOverviewScreen } from './index'
import { profileAddressOptions } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'
import NoLettersScreen from './NoLettersScreen'
import { InitialState, initialPersonalInformationState } from 'store/slices'
import { LoadingComponent } from 'components'
import { when } from 'jest-when'

let mockNavigationSpy = jest.fn()

jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('LettersOverviewScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let mockNavigateToSpy: jest.Mock

  const initializeTestInstance = (personalInformationLoading = false, personalInformationError = false) => {
    mockNavigateToSpy = jest.fn()
    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('EditAddress', { displayTitle: 'Mailing address', addressType: profileAddressOptions.MAILING_ADDRESS })
      .mockReturnValue(mockNavigateToSpy)

    const props = mockNavProps()

    component = render(<LettersOverviewScreen {...props} />, {
      preloadedState: {
        ...InitialState,
        personalInformation: {
          ...initialPersonalInformationState,
          loading: personalInformationLoading,
          error: personalInformationError ? { networkError: true } : undefined,
        },
      },
    })

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  describe('when an error occurs loading profile info', () => {
    it('should show No Letters screen', async () => {
      initializeTestInstance(false, true)
      expect(testInstance.findByType(NoLettersScreen)).toBeTruthy()
    })
  })

  it('should go to edit address when the address is pressed', async () => {
    testInstance.findAllByType(Pressable)[0].props.onPress()
    expect(mockNavigateToSpy).toHaveBeenCalled()
  })
})
