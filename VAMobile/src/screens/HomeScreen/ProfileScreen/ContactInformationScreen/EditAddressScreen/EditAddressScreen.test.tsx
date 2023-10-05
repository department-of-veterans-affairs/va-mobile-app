import React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react-native'

import { mockNavProps, QueriesData, render, when } from 'testUtils'
import EditAddressScreen from './EditAddressScreen'
import { AddressData, DeliveryPointValidationTypesConstants, UserContactInformation } from 'api/types'
import { contactInformationKeys } from 'api/contactInformation'
import { post } from 'store/api'

const residentialAddress: AddressData = {
  id: 0,
  addressLine1: '10 Laurel Way',
  addressPou: 'RESIDENCE/CHOICE',
  addressType: 'DOMESTIC',
  city: 'Novato',
  countryCodeIso3: '1',
  internationalPostalCode: '1',
  province: 'province',
  stateCode: 'CA',
  zipCode: '94920',
  zipCodeSuffix: '1234',
}
const mailingAddress: AddressData = {
  id: 1,
  addressLine1: '1707 Tiburon Blvd',
  addressLine2: 'Address line 2',
  addressLine3: 'Address line 3',
  addressPou: 'RESIDENCE/CHOICE',
  addressType: 'DOMESTIC',
  city: 'Tiburon',
  countryCodeIso3: '1',
  internationalPostalCode: '1',
  province: 'province',
  stateCode: 'CA',
  zipCode: '94920',
  zipCodeSuffix: '1234',
}

const mockAlertSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useAlert: () => mockAlertSpy,
  }
})

jest.mock('@react-navigation/native', () => {
  const original = jest.requireActual('@react-navigation/native')
  return {
    ...original,
    useNavigation: () => ({
      setOptions: jest.fn(),
      goBack: jest.fn(),
    }),
  }
})

describe('EditAddressScreen', () => {
  let props: any
  let goBackSpy: any

  const renderWithData = (isResidential?: boolean, contactInformation?: Partial<UserContactInformation>) => {
    goBackSpy = jest.fn()

    props = mockNavProps(
      {},
      {
        goBack: goBackSpy,
        addListener: jest.fn(),
      },
      {
        params: {
          displayTitle: isResidential ? 'Home Address' : 'Mailing Address',
          addressType: isResidential ? 'residentialAddress' : 'mailingAddress',
        },
      },
    )

    let queriesData: QueriesData | undefined

    if (contactInformation) {
      queriesData = [{
        queryKey: contactInformationKeys.contactInformation,
        data: {
          ...contactInformation
        }
      }]
    }

    render(<EditAddressScreen {...props} />, {queriesData})
  }

  beforeEach(() => {
    renderWithData()
  })

  describe('when the checkbox is pressed', () => {
    it('updates the value of selected', () => {
      const checkbox = screen.getByRole('checkbox', { checked: false })

      fireEvent.press(checkbox)
      expect(screen.getByRole('checkbox', { checked: true })).toBeTruthy()
    })

    describe('when the checkbox is unchecked', () => {
      beforeEach(() => {
        renderWithData(false, {mailingAddress})
        const checkbox = screen.getByRole('checkbox', { checked: false })

        fireEvent.press(checkbox)
        expect(screen.getByRole('checkbox', { checked: true })).toBeTruthy()
        
        fireEvent.press(checkbox)
        expect(screen.getByRole('checkbox', { checked: false })).toBeTruthy()
      })

      it('clears the country field', () => {
        expect(screen.getByTestId('countryPickerTestID').props.selectedValue).not.toBeTruthy()
      })

      it('sets state, city, and military post office to empty strings', () => {
        expect(screen.getByTestId('cityTestID').props.value).toEqual('')
        expect(screen.getByTestId('stateTestID').props.children).toEqual('')
        expect(screen.queryByTestId('militaryPostOfficeTestID')).toBeFalsy
      })
    })
  })

  describe('when the user selects a country with the picker', () => {
    it('updates the value of country', () => {
      const countrySelector = screen.getByTestId('countryPickerTestID')

      fireEvent.press(countrySelector)
      fireEvent.press(screen.getByText('Algeria'))
      fireEvent.press(screen.getByRole('button', { name: 'Done' }))
      expect(countrySelector.props.children).toEqual('Algeria')
    })

    describe('when the old value and new value of country are not both domestic or both international', () => {
      it('sets state and zip code to empty strings', () => {
        renderWithData(false, {mailingAddress})
        const zipCodeInput = screen.getByTestId('zipCodeTestID')

        expect(screen.getByTestId('stateTestID').props.children).toEqual('California')
        expect(zipCodeInput.props.value).toEqual(mailingAddress.zipCode)

        fireEvent.press(screen.getByTestId('countryPickerTestID'))
        fireEvent.press(screen.getByText('Algeria'))
        fireEvent.press(screen.getByRole('button', { name: 'Done' }))

        expect(screen.getByTestId('stateTestID').props.value).toEqual('')
        expect(zipCodeInput.props.value).toEqual('')
      })
    })

    describe('when the old and new value of country are both domestic or international', () => {
      it('keeps the values of state and zip code', () => {
        const mailingAddress: AddressData = {
          id: 0,
          addressLine1: '4313 Cassin Way',
          addressLine2: 'Suite 992',
          addressLine3: 'Address line 3',
          addressPou: 'CORRESPONDENCE',
          addressType: 'INTERNATIONAL',
          city: 'Lake Lucybury',
          countryCodeIso3: 'AUS',
          internationalPostalCode: '1',
          province: 'province',
          stateCode: 'Northern Territory',
          zipCode: '5922',
          zipCodeSuffix: '',
        }

        renderWithData(false, { mailingAddress })

        expect(screen.getByTestId('stateTestID').props.value).toEqual('Northern Territory')
        expect(screen.getByTestId('zipCodeTestID').props.value).toEqual('5922')

        fireEvent.press(screen.getByTestId('countryPickerTestID'))
        fireEvent.press(screen.getByText('Algeria'))
        fireEvent.press(screen.getByRole('button', { name: 'Done' }))
        
        expect(screen.getByTestId('stateTestID').props.value).toEqual('Northern Territory')
        expect(screen.getByTestId('zipCodeTestID').props.value).toEqual('5922')
      })
    })
  })

  describe('when the user enters a new address line 1', () => {
    it('updates the value of addressLine1', () => {
      const streetAddressLine1Input = screen.getByTestId('streetAddressLine1TestID')

      fireEvent.changeText(streetAddressLine1Input, 'New Address Line 1')
      expect(streetAddressLine1Input.props.value).toEqual('New Address Line 1')
    })
  })

  describe('when the user enters a new address line 2', () => {
    it('updates the value of addressLine2', () => {
      const streetAddressLine2Input = screen.getByTestId('streetAddressLine2TestID')

      fireEvent.changeText(streetAddressLine2Input, 'New Address Line 2')
      expect(streetAddressLine2Input.props.value).toEqual('New Address Line 2')
    })
  })

  describe('when the user enters a new address line 3', () => {
    it('updates the value of addressLine3', () => {
      const streetAddressLine3Input = screen.getByTestId('streetAddressLine3TestID')

      fireEvent.changeText(streetAddressLine3Input, 'New Address Line 3')
      expect(streetAddressLine3Input.props.value).toEqual('New Address Line 3')
    })
  })

  describe('when the user enters a new city', () => {
    it('updates the value of city', () => {
      const cityInput = screen.getByTestId('cityTestID')

      fireEvent.changeText(cityInput, 'New city')
      expect(cityInput.props.value).toEqual('New city')
    })
  })

  describe('when the user selects a military post office with the picker', () => {
    it('updates the value of militaryPostOffice', () => {
      const mailingAddress: AddressData = {
        id: 0,
        addressLine1: '1707 Tiburon Blvd',
        addressLine2: 'Address line 2',
        addressLine3: 'Address line 3',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'OVERSEAS MILITARY',
        city: 'Tiburon',
        countryCodeIso3: '1',
        internationalPostalCode: '1',
        province: 'province',
        stateCode: 'CA',
        zipCode: '94920',
        zipCodeSuffix: '1234',
      }

      renderWithData(false, { mailingAddress })
      const militaryPostOfficeSelector = screen.getByTestId('militaryPostOfficeTestID')

      fireEvent.press(militaryPostOfficeSelector)
      fireEvent.press(screen.getByText('APO'))
      fireEvent.press(screen.getByRole('button', { name: 'Done' }))
      expect(militaryPostOfficeSelector.props.children).toEqual('APO')
    })
  })

  describe('when the user selects a state with the picker', () => {
    it('updates the value of state', () => {
      fireEvent.press(screen.getByTestId('stateTestID'))
      fireEvent.press(screen.getByText('California'))
      fireEvent.press(screen.getByRole('button', { name: 'Done' }))
      expect(screen.getByTestId('stateTestID').props.children).toEqual('California')
    })
  })

  describe('when the user enters a new zip code', () => {
    it('updates the value of zip code', () => {
      const zipCodeInput = screen.getByTestId('zipCodeTestID')

      fireEvent.changeText(zipCodeInput, '1234')
      expect(zipCodeInput.props.value).toEqual('1234')
    })
  })

  describe('when a text input item does not exist', () => {
    it('sets it to an empty string initially', () => {
      const streetAddressLine1Input = screen.getByTestId('streetAddressLine1TestID')
      expect(streetAddressLine1Input.props.value).toEqual('')
    })
  })

  describe('when a picker item does not exist', () => {
    it('sets it to an empty string initially', () => {
      const stateSelector = screen.getByTestId('stateTestID')
      expect(stateSelector.props.children).toEqual('')
    })
  })

  describe('when the address type is OVERSEAS MILITARY', () => {
    it('initializes the checkbox with the value true', () => {
      const mailingAddress: AddressData = {
        id: 0,
        addressLine1: '1707 Tiburon Blvd',
        addressLine2: 'Address line 2',
        addressLine3: 'Address line 3',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'OVERSEAS MILITARY',
        city: 'Tiburon',
        countryCodeIso3: '1',
        internationalPostalCode: '1',
        province: 'province',
        stateCode: 'CA',
        zipCode: '94920',
        zipCodeSuffix: '1234',
      }

      renderWithData(false, { mailingAddress })

      expect(screen.getByRole('checkbox', { checked: true })).toBeTruthy()
    })
  })

  describe('when the address type is not OVERSEAS MILITARY', () => {
    it('initializes the checkbox with the value false', () => {
      expect(screen.getByRole('checkbox', { checked: false })).toBeTruthy()
    })
  })

  describe('when checkboxSelected is true', () => {
    beforeEach(() => {
      const mailingAddress: AddressData = {
        id: 0,
        addressLine1: '1707 Tiburon Blvd',
        addressLine2: 'Address line 2',
        addressLine3: 'Address line 3',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'OVERSEAS MILITARY',
        city: 'Tiburon',
        countryCodeIso3: '1',
        internationalPostalCode: '1',
        province: 'province',
        stateCode: 'CA',
        zipCode: '94920',
        zipCodeSuffix: '1234',
      }

      renderWithData(false, { mailingAddress })
    })

    describe('when the country is not already USA', () => {
      it('sets the country value to USA', () => {
        expect(screen.getByTestId('countryPickerTestID').props.children).toEqual('United States')
      })
    })

    it('disables and hides the country picker', () => {
      expect(screen.queryByText('countryPickerTestID')).toBeFalsy()
    })

    it('sets the state picker pickerOptions to MilitaryStates', () => {
      fireEvent.press(screen.getByTestId('stateTestID'))
      expect(screen.getByText('Armed Forces Americas (AA)')).toBeTruthy()
    })

    it('renders the military post office picker instead of the city text input', () => {
      expect(screen.queryByText('City (Required)')).toBeFalsy()
      expect(screen.getByText('APO/FPO/DPO (Required)')).toBeTruthy()
    })
  })

  describe('when checkboxSelected is false', () => {
    it('sets the state picker pickerOptions to States', () => {
      expect(screen.getByRole('checkbox', { checked: false }))
      fireEvent.press(screen.getByTestId('stateTestID'))
      expect(screen.getByText('Alabama')).toBeTruthy()
    })

    it('enables the country picker', () => {
      fireEvent.press(screen.getByTestId('countryPickerTestID'))
      expect(screen.getByText('Algeria')).toBeTruthy()
    })

    it('renders the city text input instead of the military post office picker', () => {
      expect(screen.queryByText('APO/FPO/DPO (Required)')).toBeFalsy()
      expect(screen.getByText('City (Required)')).toBeTruthy()
    })
  })

  describe('when the country is domestic', () => {
    it('renders the state picker', () => {
      fireEvent.press(screen.getByTestId('stateTestID'))
      expect(screen.getByText('Alabama'))
    })
  })

  describe('when the country is not domestic', () => {
    it('renders state text input', () => {
      const mailingAddress: AddressData = {
        id: 0,
        addressLine1: '4313 Cassin Way',
        addressLine2: 'Suite 992',
        addressLine3: 'Address line 3',
        addressPou: 'CORRESPONDENCE',
        addressType: 'INTERNATIONAL',
        city: 'Lake Lucybury',
        countryCodeIso3: 'AUS',
        internationalPostalCode: '1',
        province: 'province',
        stateCode: 'Northern Territory',
        zipCode: '5922',
        zipCodeSuffix: '',
      }

      renderWithData(false, { mailingAddress })

      fireEvent.press(screen.getByTestId('stateTestID'))
      expect(screen.queryByText('Alabama')).toBeFalsy()
    })
  })

  describe('when address is saved', () => {
    it('calls navigation goBack', async () => {
      const mailingAddress: AddressData = {
        id: 0,
        addressLine1: 'Unit 2050 Box 4190',
        addressLine2: '',
        addressLine3: '',
        addressPou: 'CORRESPONDENCE',
        addressType: 'OVERSEAS MILITARY',
        city: 'APO',
        countryCodeIso3: 'USA',
        internationalPostalCode: '',
        province: '',
        stateCode: 'AP',
        zipCode: '96278',
      }

      renderWithData(false, { mailingAddress })

      fireEvent.press(screen.getByRole('button', { name: 'Save' }))
      await waitFor(() => expect(goBackSpy).toBeCalled())
    })
  })

  describe('when there are suggested addresses', () => {
    it('displays the AddressValidation component', async () => {
      const mailingAddress: AddressData = {
        id: 0,
        addressLine1: 'Unit 2050 Box 4190',
        addressLine2: '',
        addressLine3: '',
        addressPou: 'CORRESPONDENCE',
        addressType: 'OVERSEAS MILITARY',
        city: 'APO',
        countryCodeIso3: 'USA',
        countryName: "United States",
        internationalPostalCode: '',
        stateCode: 'AP',
        zipCode: '96278',
      }

      const abortController = new AbortController()
      const abortSignal = abortController.signal

      when(post as jest.Mock)
        .calledWith('/v0/user/addresses/validate', mailingAddress, undefined, abortSignal)
        .mockResolvedValue(
          {
            data: [
              {
                id: 1,
                type: 'mock_type',
                attributes: {
                  addressLine1: '1707 Tiburon Blvd',
                  addressLine2: 'Address line 2',
                  addressLine3: 'Address line 3',
                  addressPou: 'RESIDENCE/CHOICE',
                  addressType: 'DOMESTIC',
                  city: 'Tiburon',
                  countryCodeIso3: '1',
                  internationalPostalCode: '1',
                  province: 'province',
                  stateCode: 'CA',
                  zipCode: '94920',
                  zipCodeSuffix: '1234',
                },
                meta: {
                  address: {
                    confidenceScore: 68,
                    addressType: 'DOMESTIC',
                    deliveryPointValidation: DeliveryPointValidationTypesConstants.MISSING_UNIT_NUMBER,
                    residentialDeliveryIndicator: 'RESIDENTIAL',
                  },
                  validationKey: 315989,
                },
              },
            ],
          })

      renderWithData(false, { mailingAddress })

      fireEvent.press(screen.getByRole('button', { name: 'Save' }))
      await waitFor(() => expect(post as jest.Mock).toBeCalledWith('/v0/user/addresses/validate', mailingAddress, undefined, abortSignal))
      await waitFor(() => expect(screen.getByText('Verify your address')).toBeTruthy())
    })
  })

  describe('when content is invalid for domestic address', () => {
    it('displays an AlertBox and a field error for each required field', () => {
      fireEvent.press(screen.getByRole('button', { name: 'Save' }))

      expect(screen.getByText('Please check your mailing address')).toBeTruthy()
      expect(screen.getByText('Country is required')).toBeTruthy()
      expect(screen.getByText('Street address is required')).toBeTruthy()
      expect(screen.getByText('City is required')).toBeTruthy()
      expect(screen.getByText('State is required')).toBeTruthy()
      expect(screen.getByText('Postal code is required')).toBeTruthy()
    })
  })

  describe('when content is invalid for military address', () => {
    it('displays an AlertBox and a field error for each required field', () => {
      fireEvent.press(screen.getByRole('button', { name: 'Save' }))

      expect(screen.getByText('Please check your mailing address')).toBeTruthy()
      expect(screen.getByText('Street address is required')).toBeTruthy()
      expect(screen.getByText('Postal code is required')).toBeTruthy()
    })
  })

  describe('when content is invalid for an international address', () => {
    it('displays an AlertBox and a field error for each required field', () => {
      fireEvent.press(screen.getByTestId('countryPickerTestID'))
      fireEvent.press(screen.getByText('Algeria'))
      fireEvent.press(screen.getByRole('button', { name: 'Save' }))

      expect(screen.getByText('Street address is required')).toBeTruthy()
      expect(screen.getByText('City is required')).toBeTruthy()
      expect(screen.getByText('Postal code is required')).toBeTruthy()
    })
  })

  describe('when the address is residential and there is address data', () => {
    it('displays the remove button', () => {
      renderWithData(true, { residentialAddress })
      expect(screen.getByRole('button', { name: 'Remove home address' })).toBeTruthy
    })
  })

  describe('validateAddress', () => {
    describe('when INTERNATIONAL', () => {
      it('passes province and internationalPostalCode as part of the expected payload', async () => {
        const mailingAddress: AddressData = {
          id: 0,
          addressLine1: '127 Harvest Moon Dr',
          addressLine2: '',
          addressLine3: '',
          addressPou: 'CORRESPONDENCE',
          addressType: 'INTERNATIONAL',
          city: 'Bolton',
          countryCodeIso3: 'CAN',
          internationalPostalCode: 'L7E 2W1',
          province: 'Ontario',
          stateCode: '',
          zipCode: '',
        }

        renderWithData(false, { mailingAddress })

        fireEvent.press(screen.getByRole('button', { name: 'Save' }))

        const abortController = new AbortController()
        const abortSignal = abortController.signal

        await waitFor(() => expect(post).toBeCalledWith('/v0/user/addresses/validate',
          {
            id: 0,
            addressLine1: '127 Harvest Moon Dr',
            addressLine2: '',
            addressLine3: '',
            addressPou: 'CORRESPONDENCE',
            addressType: 'INTERNATIONAL',
            city: 'Bolton',
            countryName: 'Canada',
            countryCodeIso3: 'CAN',
            internationalPostalCode: 'L7E 2W1',
            zipCode: '',
            province: 'Ontario',
          },
          undefined,
          abortSignal
        ))
      })
    })

    describe('when DOMESTIC', () => {
      it('passes stateCode and zipCode as part of the expected payload', async () => {
        const mailingAddress: AddressData = {
          id: 0,
          addressLine1: '1707 Tiburon Blvd',
          addressLine2: 'Address line 2',
          addressLine3: 'Address line 3',
          addressPou: 'RESIDENCE/CHOICE',
          addressType: 'DOMESTIC',
          city: 'Tiburon',
          countryCodeIso3: 'USA',
          internationalPostalCode: '1',
          province: 'province',
          stateCode: 'CA',
          zipCode: '94920',
          zipCodeSuffix: '1234',
        }

        renderWithData(false, { mailingAddress })

        fireEvent.press(screen.getByRole('button', { name: 'Save' }))

        const abortController = new AbortController()
        const abortSignal = abortController.signal

        await waitFor(() => (expect(post).toBeCalledWith('/v0/user/addresses/validate',
          {
            id: 0,
            addressLine1: '1707 Tiburon Blvd',
            addressLine2: 'Address line 2',
            addressLine3: 'Address line 3',
            addressPou: 'CORRESPONDENCE',
            addressType: 'DOMESTIC',
            city: 'Tiburon',
            countryName: 'United States',
            countryCodeIso3: 'USA',
            stateCode: 'CA',
            zipCode: '94920',
            internationalPostalCode: '',
          },
          undefined,
          abortSignal
        )))
      })
    })

    describe('when OVERSEAS MILITARY', () => {
      it('passes stateCode and zipCode as part of the expected payload', async () => {
        const mailingAddress: AddressData = {
          id: 0,
          addressLine1: 'Unit 2050 Box 4190',
          addressLine2: '',
          addressLine3: '',
          addressPou: 'CORRESPONDENCE',
          addressType: 'OVERSEAS MILITARY',
          city: 'APO',
          countryCodeIso3: 'USA',
          internationalPostalCode: '',
          province: '',
          stateCode: 'AP',
          zipCode: '96278',
        }

        renderWithData(false, { mailingAddress })

        fireEvent.press(screen.getByRole('button', { name: 'Save' }))

        const abortController = new AbortController()
        const abortSignal = abortController.signal

        await waitFor(() => expect(post).toBeCalledWith('/v0/user/addresses/validate', 
          {
            addressLine1: 'Unit 2050 Box 4190', 
            addressLine2: '', 
            addressLine3: '',
            addressPou: "CORRESPONDENCE", 
            addressType: "OVERSEAS MILITARY", 
            city: 'APO', 
            countryCodeIso3: "USA", 
            countryName: "United States", 
            id: 0, 
            internationalPostalCode: "", 
            stateCode: "AP", "zipCode": "96278"
          }, 
          undefined,
          abortSignal
        ))
      })
    })
  })

  describe('delete address', () => {
    it('calls the useDestructive hook', () => {
      renderWithData(true, { residentialAddress })

      fireEvent.press(screen.getByRole('button', { name: 'Remove home address' }))
      expect(mockAlertSpy).toHaveBeenCalled()
    })
  })
})
