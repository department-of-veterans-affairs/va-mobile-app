import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, mockStore, render, RenderAPI } from 'testUtils'

import { initialAuthState } from 'store/slices'
import AttachmentsFAQ from './AttachmentsFAQ'
import { Linking, TouchableWithoutFeedback } from 'react-native'

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

jest.mock('@react-navigation/native', () => {
  const original = jest.requireActual('@react-navigation/native')
  return {
    ...original,
    useFocusEffect: () => jest.fn(),
  }
})

context('AttachmentsFAQ', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() }, { params: { originHeader: 'TestHeader' } })

    component = render(<AttachmentsFAQ {...props} />, {
      preloadedState: {
        auth: { ...initialAuthState },
      },
    })

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the My HealtheVet phone number link is clicked', () => {
    it('should call Linking open url with the parameter tel:8773270022', async () => {
      testInstance.findAllByType(TouchableWithoutFeedback)[1].props.onPress()
      expect(Linking.openURL).toBeCalledWith('tel:8773270022')
    })
  })
  describe('when the call TTY phone link is clicked', () => {
    it('should call Linking open url with the parameter tel:711', async () => {
      testInstance.findAllByType(TouchableWithoutFeedback)[2].props.onPress()
      expect(Linking.openURL).toBeCalledWith('tel:711')
    })
  })
})
