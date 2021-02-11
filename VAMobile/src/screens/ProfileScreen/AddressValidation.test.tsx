import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, mockStore, renderWithProviders, findByTestID } from 'testUtils'
import AddressValidation from './AddressValidation'
import { initialPersonalInformationState, InitialState } from 'store/reducers'
import { AddressData, AddressValidationScenarioTypes, AddressValidationScenarioTypesConstants } from 'store/api/types'
import { TextView } from 'components'
import { finishValidateAddress, updateAddress } from 'store'

const mockAddress: AddressData =  {
  addressLine1: "2248 San Miguel Ave.",
  addressPou: "CORRESPONDENCE",
  addressType: "DOMESTIC",
  city: "Santa Rosa",
  countryName: "United States",
  countryCodeIso3: "USA",
  stateCode: "CA",
  zipCode: "95403"
}

const mockedNavigate = jest.fn();
const mockedNavigationGoBack = jest.fn()

jest.mock('@react-navigation/native', () => {
  let actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockedNavigate,
      goBack: mockedNavigationGoBack
    }),
  };
});

jest.mock('../../store/actions', () => {
  let actual = jest.requireActual('../../store/actions')
  return {
    ...actual,
    updateAddress: jest.fn(() => {
      return {
        type: '',
        payload: ''
      }
    }),
    finishValidateAddress: jest.fn(() => {
      return {
        type: '',
        payload: ''
      }
    })
  }
})

context('AddressValidation', () => {
  let component: any
  let store: any
  let testInstance: ReactTestInstance


  const prepInstanceWithStore = (addressValidationScenario: AddressValidationScenarioTypes = AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE) => {
    store = mockStore({
      ...InitialState,
      personalInformation: {
        ...initialPersonalInformationState,
        addressValidationScenario,
        addressData: mockAddress
      }
    })

    act(() => {
      component = renderWithProviders(
        <AddressValidation addressLine1={mockAddress.addressLine1} city={mockAddress.city} state={mockAddress.stateCode as string} zipCode={mockAddress.zipCode} addressId={12345}  />, store
      )
    })

    testInstance = component.root
  }

  beforeEach(() => {
    prepInstanceWithStore()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the address validation scenario type is BAD_UNIT', () => {
    it('should display the BAD_UNIT alert texts', async () => {
      prepInstanceWithStore(AddressValidationScenarioTypesConstants.BAD_UNIT_NUMBER_OVERRIDE)
      const textViews = testInstance.findAllByType(TextView)
      const alertTitle = textViews[0]
      const alertBody = textViews[1]
      expect(alertTitle).toBeTruthy()
      expect(alertBody).toBeTruthy()
      expect(alertTitle.props.children).toEqual("Please update or confirm your unit number.")
      expect(alertBody.props.children).toEqual("We couldn't verify your address with the U.S Postal Service because there may be a problem with the unit number. Please edit your address to update the unit number. If your unit number is already correct, please continue with the address you entered below.")
    })
  })

  describe('when the address validation scenario type is MISSING_UNIT_OVERRIDE', () => {
    it('should display the BAD_UNIT alert texts', async () => {
      prepInstanceWithStore(AddressValidationScenarioTypesConstants.MISSING_UNIT_OVERRIDE)
      const textViews = testInstance.findAllByType(TextView)
      const alertTitle = textViews[0]
      const alertBody = textViews[1]
      expect(alertTitle).toBeTruthy()
      expect(alertBody).toBeTruthy()
      expect(alertTitle.props.children).toEqual("Please add a unit number")
      expect(alertBody.props.children).toEqual("It looks like your address is missing a unit number. Please edit your address to add a unit number. If you don't have a unit number and the address you entered below is correct, please select it.")
    })
  })

  describe('when the address validation scenario type is SHOW_SUGGESTIONS_OVERRIDE', () => {
    it('should display the BAD_UNIT alert texts', async () => {
      prepInstanceWithStore(AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE)
      const textViews = testInstance.findAllByType(TextView)
      const alertTitle = textViews[0]
      const alertBody = textViews[1]
      expect(alertTitle).toBeTruthy()
      expect(alertBody).toBeTruthy()
      expect(alertTitle.props.children).toEqual("Please confirm your address")
      expect(alertBody.props.children).toEqual("We couldn't confirm your address with the U.S. Postal Service. Please verify your address so we can save it to your VA Profile. If the address you entered isn't correct, please edit it or choose a suggested address below.")
    })
  })

  describe('when the address validation scenario type is SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE', () => {
    it('should display the BAD_UNIT alert texts', async () => {
      prepInstanceWithStore(AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE)
      const textViews = testInstance.findAllByType(TextView)
      const alertTitle = textViews[0]
      const alertBody = textViews[1]
      expect(alertTitle).toBeTruthy()
      expect(alertBody).toBeTruthy()
      expect(alertTitle.props.children).toEqual("Please confirm your address")
      expect(alertBody.props.children).toEqual("We couldn't confirm your address with the U.S. Postal Service. Please verify your address so we can save it to your VA Profile. If the address you entered isn't correct, please edit it. If the address listed below is correct, please select it.")
    })
  })

  describe('When use this address button is pressed', () => {
    it('should call updateAddress', async () => {
      prepInstanceWithStore(AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE)
      const useThisAddressButton = findByTestID(testInstance, 'Use this address')
      expect(useThisAddressButton).toBeTruthy()

      useThisAddressButton.props.onPress()
      expect(updateAddress).toBeCalled()
    })
  })

  describe('When cancel button is pressed', () => {
    it('should call finishValidateAddress', async () => {
      prepInstanceWithStore(AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE)
      const cancelButton = findByTestID(testInstance, 'Cancel')
      expect(cancelButton).toBeTruthy()

      cancelButton.props.onPress()
      expect(finishValidateAddress).toBeCalled()
    })
  })

})
