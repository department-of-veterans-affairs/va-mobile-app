import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, render, RenderAPI } from 'testUtils'

import { InitialState } from 'store/slices'
import PendingAppointmentCancelButton from './PendingAppointmentCancelButton'
import { defaultAppointmentAttributes } from 'utils/tests/appointments'
import { AppointmentStatusConstants } from 'store/api/types/AppointmentData'
import { VAButton } from 'components'

const mockAlertSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default
  return {
    ...original,
    useDestructiveActionSheet: () => mockAlertSpy,
  }
})

context('PendingAppointmentCancelButton', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (): void => {
    props = {
      ...defaultAppointmentAttributes,
      isPending: true,
      status: AppointmentStatusConstants.SUBMITTED,
    }

    component = render(<PendingAppointmentCancelButton attributes={props} />, {
      preloadedState: {
        ...InitialState,
      },
    })

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('cancel pending appointment', () => {
    it('should call the useDestructive hook', async () => {
      act(() => {
        testInstance.findByType(VAButton).props.onPress()
      })
      expect(mockAlertSpy).toHaveBeenCalled()
    })
  })
})
