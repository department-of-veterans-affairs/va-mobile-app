import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import { context, mockStore, render, RenderAPI } from 'testUtils'

import { Pressable } from 'react-native'
import { LettersOverviewScreen } from './index'
import { profileAddressOptions } from '../AddressSummary'
import { InitialState, initialPersonalInformationState } from 'store/slices'
import { LoadingComponent } from 'components'
import { when } from 'jest-when'

let mockNavigationSpy = jest.fn()

jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  let theme = jest.requireActual('styles/themes/standardTheme').default
  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('LettersOverviewScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let mockNavigateToSpy: jest.Mock

  const initializeTestInstance = (personalInformationLoading = false) => {
    mockNavigateToSpy = jest.fn()
    when(mockNavigationSpy).mockReturnValue(() => {})
        .calledWith('EditAddress', { displayTitle: 'Mailing address', addressType: profileAddressOptions.MAILING_ADDRESS }).mockReturnValue(mockNavigateToSpy)

    component = render(<LettersOverviewScreen />, {
      preloadedState: {
        ...InitialState,
        personalInformation: {
          ...initialPersonalInformationState,
          loading: personalInformationLoading,
        },
      },
    })

    testInstance = component.container
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

  it('should go to edit address when the address is pressed', async () => {
    testInstance.findAllByType(Pressable)[0].props.onPress()
    expect(mockNavigateToSpy).toHaveBeenCalled()
  })
})
