import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'

import AppealCurrentStatus from './AppealCurrentStatus'
import {AppealAOJTypes, AppealStatusData, AppealTypes} from 'store/api/types'
import {InitialState} from 'store/reducers'

context('AppealStatus', () => {
  let component: any
  let props: any
  let store: any
  let testInstance: ReactTestInstance

  let status: AppealStatusData = {
    details: {},
    type: 'scheduled_hearing'
  }

  const initializeTestInstance = (status: AppealStatusData, aoj: AppealAOJTypes, appealType: AppealTypes) => {
    props = mockNavProps({
      status,
      aoj,
      appealType
    })

    store = mockStore({
      ...InitialState,
      personalInformation: {
        ...InitialState.personalInformation,
        profile: {
          ...InitialState.personalInformation.profile,
          fullName: 'Larry Brown'
        }
      }
    })

    act(() => {
      component = renderWithProviders(<AppealCurrentStatus {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance(status, 'vba', 'higherLevelReview')
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })
})
