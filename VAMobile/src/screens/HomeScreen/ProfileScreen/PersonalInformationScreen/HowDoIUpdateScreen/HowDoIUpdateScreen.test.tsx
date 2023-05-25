import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, mockStore, render, RenderAPI, waitFor } from 'testUtils'

import HowDoIUpdateScreen from './HowDoIUpdateScreen'
import { initialAuthState } from 'store/slices'
import { TextView } from 'components'

let mockNavigationSpy = jest.fn()
jest.mock('../../../../../utils/hooks', () => {
  let original = jest.requireActual('../../../../../utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('@react-navigation/native', () => {
  const original = jest.requireActual('@react-navigation/native')
  return {
    ...original,
    useFocusEffect: () => jest.fn(),
  }
})

context('HowDoIUpdateScreen', () => {
  let store: any
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let mockNavigationToSpy: jest.Mock

  beforeEach(async () => {
    const props = mockNavProps(
      {},
      { setOptions: jest.fn(), navigate: jest.fn() },
      {
        params: {
          screenType: 'DOB',
        },
      },
    )
    mockNavigationToSpy = jest.fn()
    mockNavigationSpy.mockReturnValue(mockNavigationToSpy)

    store = mockStore({
      auth: { ...initialAuthState },
    })

    await waitFor(() => {
      component = render(<HowDoIUpdateScreen {...props} />, {
        preloadedState: {
          auth: {
            ...initialAuthState,
          },
        },
      })
    })

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the find VA location link is clicked', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findAllByType(TextView)[5].props.onPress()
      expect(mockNavigationSpy).toBeCalledWith('Webview', { displayTitle: 'va.gov', url: 'https://www.va.gov/find-locations/', loadingMessage: 'Loading VA location finder...' })
      expect(mockNavigationToSpy).toBeCalled()
    })
  })
})
