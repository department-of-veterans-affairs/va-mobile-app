import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import { context, mockNavProps, render, RenderAPI } from 'testUtils'
import { act } from 'react-test-renderer'

import { InitialState } from 'store/slices'
import PrepareForVideoVisit from './PrepareForVideoVisit'
import { TextView } from 'components'

context('PrepareForVideoVisit', () => {
  let component: RenderAPI
  let testInstance: any
  let props: any

  beforeEach(() => {
    props = mockNavProps({}, { setOptions: jest.fn() })

    component = render(<PrepareForVideoVisit {...props} />, {
      preloadedState: {
        ...InitialState,
      },
    })

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
    expect(testInstance.findAllByType(TextView).length).toEqual(13)
  })
})
