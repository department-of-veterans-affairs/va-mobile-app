import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'

import AppealStatus from './AppealStatus'
import {InitialState} from 'store/reducers'
import {UserDataProfile} from 'store/api/types'

context('AppealStatus', () => {
  let component: any
  let props: any
  let store: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    props = mockNavProps({
      events: [
        {
          data: '2020-11-12',
          type: 'hlr_request'
        }
      ],
      status: {
        details: {},
        type: 'scheduled_hearing'
      },
      aoj: 'vba',
      appealType: 'higherLevelReview'
    })

    store = mockStore({
      ...InitialState,
      personalInformation: {
        ...InitialState.personalInformation,
        profile: {} as UserDataProfile
      },
    })

    act(() => {
      component = renderWithProviders(<AppealStatus {...props} />, store)
    })

    testInstance = component.root
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })
})
