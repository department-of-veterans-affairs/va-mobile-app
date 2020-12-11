import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { context, renderWithProviders, mockNavProps } from 'testUtils'
import { act } from 'react-test-renderer'

import WhatDoIDoIfDisagreement from './WhatDoIDoIfDisagreement'

context('WhatDoIDoIfDisagreement', () => {
  let component: any

  beforeEach(() => {
    const props = mockNavProps(undefined, { setOptions: jest.fn() })

    act(() => {
      component = renderWithProviders(<WhatDoIDoIfDisagreement {...props} />)
    })
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
