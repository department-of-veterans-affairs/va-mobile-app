import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, mockStore, render, RenderAPI, waitFor } from 'testUtils'

import { InitialState } from 'store/slices'
import { TextView } from 'components'
import AppointmentReason from './AppointmentReason'

context('AppointmentReason', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance
  let reasonText = 'New Issue: 22.4.55'

  const initializeTestInstance = (reason: string | null): void => {
    props = mockNavProps({
      reason: reason,
    })

    component = render(<AppointmentReason {...props} />, {
      preloadedState: {
        ...InitialState,
      },
    })

    testInstance = component.container
  }

  beforeEach(() => {
    initializeTestInstance(reasonText)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when reason exists', () => {
    it('should render a TextView with the reason text', async () => {
      const texts = testInstance.findAllByType(TextView)
      expect(texts[0].props.children).toBe('You shared these details about your concern')
      expect(texts[1].props.children).toBe(reasonText)
    })
  })
})
