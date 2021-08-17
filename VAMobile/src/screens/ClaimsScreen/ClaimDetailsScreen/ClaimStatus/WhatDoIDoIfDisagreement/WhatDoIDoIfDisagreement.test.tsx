import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { context, renderWithProviders, mockNavProps } from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import WhatDoIDoIfDisagreement from './WhatDoIDoIfDisagreement'
import {TextView} from 'components'

const mockExternalLinkSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default

  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
  }
})

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
    it('should launch external link', async () => {
      testInstance.findAllByType(TextView)[2].props.onPress()
      expect(mockExternalLinkSpy).toHaveBeenCalled()
    })
  })
})
