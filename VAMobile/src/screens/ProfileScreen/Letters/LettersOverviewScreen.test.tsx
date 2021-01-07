import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import {context, mockStore, renderWithProviders} from 'testUtils'

import { Pressable } from 'react-native'
import { LettersOverviewScreen } from './index'
import { profileAddressOptions } from "../AddressSummary"
import { InitialState } from 'store/reducers'

let mockNavigationSpy = jest.fn(()=> {
  return jest.fn()
})
let store: any

jest.mock('../../../utils/hooks', () => {
  let original = jest.requireActual("../../../utils/hooks")
  let theme = jest.requireActual("../../../styles/themes/standardTheme").default
  return {
    ...original,
    useTheme: jest.fn(()=> {
      return {...theme}
    }),
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('LettersOverviewScreen', () => {
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    store = mockStore({
      ...InitialState
    })

    act(() => {
      component = renderWithProviders(<LettersOverviewScreen />, store)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should go to edit address when the address is pressed', async () => {
    testInstance.findAllByType(Pressable)[0].props.onPress()
    expect(mockNavigationSpy).toBeCalledWith('EditAddress', { displayTitle: 'Mailing address', addressType: profileAddressOptions.MAILING_ADDRESS })  })
})
