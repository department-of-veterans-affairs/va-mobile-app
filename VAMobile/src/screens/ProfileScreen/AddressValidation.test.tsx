import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, mockStore, renderWithProviders, findByTestID } from 'testUtils'
import AddressValidation from './AddressValidation'
import { initialPersonalInformationState, InitialState } from 'store/reducers'
import { AddressData, AddressValidationScenarioTypes, AddressValidationScenarioTypesConstants } from 'store/api/types'
import { AccordionCollapsible, TextView, VASelector } from 'components'
import { updateAddress } from 'store'
import { Pressable, TouchableWithoutFeedback } from 'react-native'

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

jest.mock('../../store/actions', () => {
  let actual = jest.requireActual('../../store/actions')
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
  let component: any
  let store: any
  let testInstance: ReactTestInstance

  const prepInstanceWithStore = (addressValidationScenario: AddressValidationScenarioTypes = AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE) => {
    store = mockStore({
      ...InitialState,
      personalInformation: {
        ...initialPersonalInformationState,
        addressValidationScenario,
        addressData: mockAddress,
      },
    })

    act(() => {
      component = renderWithProviders(<AddressValidation addressEntered={mockAddress} addressId={12345} />, store)
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

      act(() => {
        testInstance.findAllByType(AccordionCollapsible)[0].findByType(Pressable).props.onPress()
      })

      const textViews = testInstance.findAllByType(TextView)
      const alertTitle = textViews[0]
      const alertBody = textViews[1]
      expect(alertTitle).toBeTruthy()
      expect(alertBody).toBeTruthy()
      expect(alertTitle.props.children).toEqual('Update or confirm your unit number')
      expect(alertBody.props.children).toEqual(
        "We couldn't verify your address with the U.S. Postal Service because there may be a problem with the unit number. Edit your address to update the unit number. If your unit number is already correct, continue with the address you entered below.",
      )
    })
  })

  describe('when the address validation scenario type is MISSING_UNIT_OVERRIDE', () => {
    it('should display the BAD_UNIT alert texts', async () => {
      prepInstanceWithStore(AddressValidationScenarioTypesConstants.MISSING_UNIT_OVERRIDE)

      act(() => {
        testInstance.findAllByType(AccordionCollapsible)[0].findByType(Pressable).props.onPress()
      })

      const textViews = testInstance.findAllByType(TextView)
      const alertTitle = textViews[0]
      const alertBody = textViews[1]
      expect(alertTitle).toBeTruthy()
      expect(alertBody).toBeTruthy()
      expect(alertTitle.props.children).toEqual('Add a unit number')
      expect(alertBody.props.children).toEqual(
        "It looks like your address is missing a unit number. Edit your address to add a unit number. If you don't have a unit number and the address you entered below is correct, select it.",
      )
    })
  })

  describe('when the address validation scenario type is SHOW_SUGGESTIONS_OVERRIDE', () => {
    it('should display the BAD_UNIT alert texts', async () => {
      prepInstanceWithStore(AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE)

      act(() => {
        testInstance.findAllByType(AccordionCollapsible)[0].findByType(Pressable).props.onPress()
      })

      const textViews = testInstance.findAllByType(TextView)
      const alertTitle = textViews[0]
      const alertBody = textViews[1]
      expect(alertTitle).toBeTruthy()
      expect(alertBody).toBeTruthy()
      expect(alertTitle.props.children).toEqual('Confirm your address')
      expect(alertBody.props.children).toEqual(
        "We couldn't confirm your address with the U.S. Postal Service. Verify your address so we can save it to your VA profile. If the address you entered isn't correct, edit it. If the address listed below is correct, select it.",
      )
    })
  })

  describe('when the address validation scenario type is SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE', () => {
    it('should display the BAD_UNIT alert texts', async () => {
      prepInstanceWithStore(AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE)

      act(() => {
        testInstance.findAllByType(AccordionCollapsible)[0].findByType(Pressable).props.onPress()
      })

      const textViews = testInstance.findAllByType(TextView)
      const alertTitle = textViews[0]
      const alertBody = textViews[1]
      expect(alertTitle).toBeTruthy()
      expect(alertBody).toBeTruthy()
      expect(alertTitle.props.children).toEqual('Confirm your address')
      expect(alertBody.props.children).toEqual(
        "We couldn't confirm your address with the U.S. Postal Service. Verify your address so we can save it to your VA profile. If the address you entered isn't correct, edit it. If the address listed below is correct, select it.",
      )
    })
  })

  describe('When use this address button is pressed', () => {
    it('should call updateAddress', async () => {
      prepInstanceWithStore(AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE)

      act(() => {
        testInstance.findAllByType(AccordionCollapsible)[0].findByType(Pressable).props.onPress()
      })

      testInstance.findAllByType(VASelector)[0].findByType(TouchableWithoutFeedback).props.onPress()

      const useThisAddressButton = findByTestID(testInstance, 'Use This Address')
      expect(useThisAddressButton).toBeTruthy()

      useThisAddressButton.props.onPress()
      expect(updateAddress).toBeCalled()
    })
  })
})
