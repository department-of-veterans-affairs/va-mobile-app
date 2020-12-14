import 'react-native'
import React from 'react'
import {Linking} from 'react-native'
// Note: test renderer must be required after react-native.
import { context, renderWithProviders, mockNavProps } from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import WhatDoIDoIfDisagreement from './WhatDoIDoIfDisagreement'
import {TextView} from 'components'

context('WhatDoIDoIfDisagreement', () => {
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    const props = mockNavProps(undefined, { setOptions: jest.fn() })

    act(() => {
      component = renderWithProviders(<WhatDoIDoIfDisagreement {...props} />)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('on click of the decision review link', () => {
    it('should call Linking openURL', async () => {
      testInstance.findAllByType(TextView)[2].props.onPress()
      expect(Linking.openURL).toHaveBeenCalled()
    })
  })
})
