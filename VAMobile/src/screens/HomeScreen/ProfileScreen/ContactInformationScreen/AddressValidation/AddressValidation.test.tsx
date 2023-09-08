import 'react-native'
import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { context, render } from 'testUtils'
import AddressValidation from './AddressValidation'
import { AddressData, AddressValidationScenarioTypes, AddressValidationScenarioTypesConstants } from 'store/api/types'
import { updateAddress, initialPersonalInformationState, InitialState } from 'store/slices'
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

jest.mock('@react-navigation/native', () => {
  let actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
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
  const prepInstanceWithStore = (addressValidationScenario: AddressValidationScenarioTypes = AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE) => {
    render(<AddressValidation addressEntered={mockAddress} addressId={12345} snackbarMessages={snackbarMessages} />, {
      preloadedState: {
        ...InitialState,
        personalInformation: {
          ...initialPersonalInformationState,
          addressValidationScenario,
          addressData: mockAddress,
        },
      },
    })
  }

  beforeEach(() => {
    prepInstanceWithStore()
  })

  it('initializes correctly', async () => {
    expect(screen.getByText("You entered:")).toBeTruthy()
    expect(screen.getByText("2248 San Miguel Ave.\nSanta Rosa, CA, 95403")).toBeTruthy()
  })

  describe('when the address validation scenario type is SHOW_SUGGESTIONS_OVERRIDE', () => {
    it('should display the alert texts', async () => {
      prepInstanceWithStore(AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE)
      fireEvent.press(screen.getByText('Verify your address'))
      expect(screen.getByText("We can't confirm the address you entered with the U.S. Postal Service.")).toBeTruthy()
      expect(screen.getByText("Select which address you'd like us to use.")).toBeTruthy()
    })
  })

  describe('When use this address button is pressed', () => {
    it('should call updateAddress', async () => {
      prepInstanceWithStore(AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE)
      fireEvent.press(screen.getByTestId('Use this address'))
      expect(updateAddress).toBeCalled()
    })
  })
})
