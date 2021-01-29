import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'

import HowDoIUpdateScreen from './HowDoIUpdateScreen'
import {initialAuthState} from 'store/reducers'
import {TextView} from 'components'

let mockNavigationSpy = jest.fn()
jest.mock('../../../../utils/hooks', () => {
  let original = jest.requireActual("../../../../utils/hooks")
  let theme = jest.requireActual("../../../../styles/themes/standardTheme").default
  return {
    ...original,
    useTheme: jest.fn(()=> {
      return {...theme}
    }),
    useRouteNavigation: () => { return () => mockNavigationSpy},
  }
})

jest.mock('@react-navigation/native', () => {
  const original = jest.requireActual('@react-navigation/native')
  return {
    ...original,
    useFocusEffect: () => jest.fn(),
  };
})

context('HowDoIUpdateScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })

    store = mockStore({
      auth: {...initialAuthState},
    })

    act(() => {
      component = renderWithProviders(<HowDoIUpdateScreen {...props} />, store)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the find VA location link is clicked', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findAllByType(TextView)[4].props.onPress()
      expect(mockNavigationSpy).toBeCalled()
    })
  })
})
