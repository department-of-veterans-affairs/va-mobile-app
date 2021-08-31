import 'react-native'
import Clipboard from '@react-native-community/clipboard'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import { context, mockStore, renderWithProviders } from 'testUtils'

import { TextView, TextArea } from 'components'
import DebugScreen from './index'
import {initialAuthState} from "../../../../store/reducers";

const authTokensIdxStart = 2
context('DebugScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance
  const authCredentials = {
    access_token: 'PacsDkFjpqYylPHGTvDy',
    id_token: 'eyJraWQi0iJ0cTdYVk80ZmRPejgNjlJaUZxS2VVfn21',
    refresh_token: '4uTqcG7KY2Lh86CaSrAtwmgCgiofzHz7v0NKDz',
  }

  beforeEach(() => {
    store = mockStore({
      auth: { ...initialAuthState, authCredentials },
    })

    act(() => {
      component = renderWithProviders(<DebugScreen />, store)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()

    const textViews = testInstance.findAllByType(TextView)
    expect(textViews.length).toBeGreaterThan(6)
    expect(textViews[authTokensIdxStart].props.children).toBe('Auth Tokens')
    expect(textViews[authTokensIdxStart +1].props.children).toBe('access_token')
    expect(textViews[authTokensIdxStart + 2].props.children).toBe(authCredentials.access_token)
    expect(textViews[authTokensIdxStart + 3].props.children).toBe('refresh_token')
    expect(textViews[authTokensIdxStart + 4].props.children).toBe(authCredentials.refresh_token)
    expect(textViews[authTokensIdxStart + 5].props.children).toBe('id_token')
    expect(textViews[authTokensIdxStart + 6].props.children).toBe(authCredentials.id_token)
  })

  it('should copy text to clipboard', async() => {
    const textAreas = testInstance.findAllByType(TextArea)
    expect(textAreas.length).toBeGreaterThan(3)

    textAreas[authTokensIdxStart + 1].props.onPress()
    expect(Clipboard.setString).toBeCalledWith(authCredentials.access_token)

    textAreas[authTokensIdxStart + 2].props.onPress()
    expect(Clipboard.setString).toBeCalledWith(authCredentials.refresh_token)

    textAreas[authTokensIdxStart + 3].props.onPress()
    expect(Clipboard.setString).toBeCalledWith(authCredentials.id_token)
  })
})
