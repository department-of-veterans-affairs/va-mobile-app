import 'react-native'
import Clipboard from '@react-native-community/clipboard'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import { context, findByTypeWithText, mockStore, render, RenderAPI, findByOnPressFunction } from 'testUtils'

import { TextView, TextArea } from 'components'
import DebugScreen from './index'
import { initialAuthState, initialAnalyticsState } from 'store/slices'
import { Pressable } from 'react-native'

const authTokensIdxStart = 4
context('DebugScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  const authCredentials = {
    access_token: 'PacsDkFjpqYylPHGTvDy',
    id_token: 'eyJraWQi0iJ0cTdYVk80ZmRPejgNjlJaUZxS2VVfn21',
    refresh_token: '4uTqcG7KY2Lh86CaSrAtwmgCgiofzHz7v0NKDz',
  }

  beforeEach(() => {
    component = render(<DebugScreen />, {
      preloadedState: {
        auth: { ...initialAuthState, authCredentials },
        analytics: {
          ...initialAnalyticsState,
        },
      },
    })

    testInstance = component.container
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()

    const textViews = testInstance.findAllByType(TextView)
    expect(textViews.length).toBeGreaterThan(6)
    expect(textViews[authTokensIdxStart].props.children).toBe('Auth Tokens')
    expect(textViews[authTokensIdxStart + 1].props.children).toBe('access_token')
    expect(textViews[authTokensIdxStart + 2].props.children).toBe(authCredentials.access_token)
    expect(textViews[authTokensIdxStart + 3].props.children).toBe('refresh_token')
    expect(textViews[authTokensIdxStart + 4].props.children).toBe(authCredentials.refresh_token)
    expect(textViews[authTokensIdxStart + 5].props.children).toBe('id_token')
    expect(textViews[authTokensIdxStart + 6].props.children).toBe(authCredentials.id_token)
  })

  it('should copy text to clipboard', async () => {
    const textAreas = testInstance.findAllByType(TextArea)
    expect(textAreas.length).toBeGreaterThan(3)

    textAreas[authTokensIdxStart + 1].props.onPress()
    expect(Clipboard.setString).toBeCalledWith(authCredentials.access_token)

    textAreas[authTokensIdxStart + 2].props.onPress()
    expect(Clipboard.setString).toBeCalledWith(authCredentials.refresh_token)

    textAreas[authTokensIdxStart + 3].props.onPress()
    expect(Clipboard.setString).toBeCalledWith(authCredentials.id_token)
  })

  describe('toggle firebase debug mode', () => {
    it('should say enable if not yet enabled', async () => {
      expect(findByTypeWithText(testInstance, TextView, 'Enable Firebase debug mode')).toBeTruthy()
    })

    it('pressing the button should toggle the debug mode', async () => {
      findByOnPressFunction(testInstance, Pressable, 'onClickFirebaseDebugMode')?.props.onPress()
      expect(findByTypeWithText(testInstance, TextView, 'Disable Firebase debug mode')).toBeTruthy()
    })
  })
})
