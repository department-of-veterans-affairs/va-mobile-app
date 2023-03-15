import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'

import { context, mockNavProps, render, RenderAPI } from 'testUtils'
import { ErrorComponent, RadioGroup, TextView, VAButton } from 'components'
import { CommonErrorTypesConstants } from 'constants/errors'
import { GenderIdentityOptions } from 'store/api'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { ErrorsState, getGenderIdentityOptions, initialErrorsState, initializeErrorsByScreenID, InitialState } from 'store/slices'
import GenderIdentityScreen from './GenderIdentityScreen'

const genderIdentityOptions: GenderIdentityOptions = {
  M: 'Man',
  B: 'Non-binary',
  TM: 'Transgender man',
  TF: 'Transgender woman',
  F: 'Woman',
  N: 'Prefer not to answer',
  O: 'A gender not listed here',
}

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    getGenderIdentityOptions: jest.fn(() => {
      return {
        type: '',
        payload: genderIdentityOptions,
      }
    }),
  }
})

context('GenderIdentityScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = (preloadGenderIdentityOptions?: boolean, errorsState: ErrorsState = initialErrorsState) => {
    const props = mockNavProps()
    const store = {
      ...InitialState,
      personalInformation: { 
        ...InitialState.personalInformation, 
        genderIdentityOptions: preloadGenderIdentityOptions ? genderIdentityOptions : {}
      },
      errors: errorsState
    }

    component = render(<GenderIdentityScreen {...props} />, {preloadedState: store})
    testInstance = component.container
  }

  it('initializes correctly', async () => {
    initializeTestInstance()
    expect(component).toBeTruthy()
  })

  it('fetches gender identity options from the API if they were not previously fetched', async () => {
    initializeTestInstance()
    expect(getGenderIdentityOptions).toBeCalled()
  })

  it('does not fetch gender identity options from the API if they were previously fetched', async() => {
    initializeTestInstance(true)
    expect(getGenderIdentityOptions).not.toHaveBeenCalled()
  })

  it('sets up radio group correctly', async () => {
    initializeTestInstance()

    const radioGroup = testInstance.findAllByType(RadioGroup)[0]
    expect(radioGroup.props.value).toEqual(undefined)
  })

  it('shows an error message on save when a gender identity type has not been selected', async () => {
    initializeTestInstance()

    testInstance.findAllByType(VAButton)[0].props.onPress()
    const textViews = testInstance.findAllByType(TextView)
    expect(textViews[4].props.children).toEqual('Select an option')
  })

  it('renders the ErrorComponent when an error occurs', async () => {
    const errorsByScreenID = initializeErrorsByScreenID()
    errorsByScreenID[ScreenIDTypesConstants.GENDER_IDENTITY_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

    const errorsState: ErrorsState = {
      ...initialErrorsState,
      errorsByScreenID,
    }
    
    initializeTestInstance(false, errorsState)
    expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
  })
})
