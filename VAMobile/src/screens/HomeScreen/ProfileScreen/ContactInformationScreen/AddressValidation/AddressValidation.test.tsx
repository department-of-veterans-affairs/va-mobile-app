import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, render, findByTestID, RenderAPI } from 'testUtils'
import AddressValidation from './AddressValidation'
import { AddressData, AddressValidationScenarioTypes, AddressValidationScenarioTypesConstants } from 'store/api/types'
import { CollapsibleAlert, TextView } from 'components'
import { updateAddress, initialPersonalInformationState, InitialState } from 'store/slices'
import { Pressable } from 'react-native'
import { SnackbarMessages } from 'components/SnackBar'

const mockAddress: AddressData = {
  addressLine1: '2248 San Miguel Ave.',
  addressPou: 'CORRESPONDENCE',
  addressType: 'DOMESTIC',
  city: 'Santa Rosa',
  countryName: 'United States',
  countryCodeIso3: 'USA',
  stateCode: 'CA',
  zipCode: '95403',
}

const snackbarMessages: SnackbarMessages = {
  successMsg: 'address saved',
  errorMsg: 'address could not be saved',
}

const mockedNavigate = jest.fn()
const mockedNavigationGoBack = jest.fn()
const mockedCancel = jest.fn()

jest.mock('@react-navigation/native', () => {
  let actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockedNavigate,
      goBack: mockedNavigationGoBack,
      setOptions: jest.fn(),
    }),
  }
})

jest.mock('../../../../../store/slices', () => {
  let actual = jest.requireActual('../../../../../store/slices')
  return {
    ...actual,
    updateAddress: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

context('AddressValidation', () => {
  let component: RenderAPI

  let testInstance: ReactTestInstance

  const prepInstanceWithStore = (addressValidationScenario: AddressValidationScenarioTypes = AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE) => {
    component = render(<AddressValidation addressEntered={mockAddress} addressId={12345} snackbarMessages={snackbarMessages} />, {
      preloadedState: {
        ...InitialState,
        personalInformation: {
          ...initialPersonalInformationState,
          addressValidationScenario,
          addressData: mockAddress,
        },
      },
    })

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    prepInstanceWithStore()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the address validation scenario type is SHOW_SUGGESTIONS_OVERRIDE', () => {
    it('should display the alert texts', async () => {
      prepInstanceWithStore(AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE)

      act(() => {
        testInstance.findByType(CollapsibleAlert).findByType(Pressable).props.onPress()
      })

      const textViews = testInstance.findAllByType(TextView)
      const alertTitle = textViews[0]
      const alertBody = textViews[1]
      expect(alertTitle).toBeTruthy()
      expect(alertBody).toBeTruthy()
      expect(alertTitle.props.children).toEqual('Verify your address')
      expect(alertBody.props.children).toEqual("We can't confirm the address you entered with the U.S. Postal Service.\n\nSelect which address you'd like us to use.")
    })
  })

  describe('When use this address button is pressed', () => {
    it('should call updateAddress', async () => {
      prepInstanceWithStore(AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE)

      act(() => {
        testInstance.findByType(CollapsibleAlert).findByType(Pressable).props.onPress()
      })

      const useThisAddressButton = findByTestID(testInstance, 'Use this address')
      expect(useThisAddressButton).toBeTruthy()

      useThisAddressButton.props.onPress()
      expect(updateAddress).toBeCalled()
    })
  })
})
