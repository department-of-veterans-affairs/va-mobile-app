import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders } from 'testUtils'
import NoDisabilityRatings from './NoDisabilityRatings'
import { TextView } from 'components'

context('NoDisabilityRatings', () => {
  let component: any
  let store: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = () => {
    act(() => {
      component = renderWithProviders(<NoDisabilityRatings />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should render text fields correctly', async () => {
    const texts = testInstance.findAllByType(TextView)
    expect(texts[0].props.children).toBe('You do not have a V\ufeffA combined disability rating on record.')
    expect(texts[1].props.children).toBe(
      "This tool doesn't include ratings for any disability claims that are still in process. You can check the status of pending claims with the claims status tool.",
    )
  })
})
