import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, mockStore, renderWithProviders} from 'testUtils'
import AddressValidation from './AddressValidation'
import { InitialState } from 'store/reducers'

const mockAddress =  {
  addressLine1: "2248 San Miguel Ave.",
  addressPou: "CORRESPONDENCE",
  addressType: "DOMESTIC",
  city: "Santa Rosa",
  countryName: "United States",
  countryCodeIso3: "USA",
  stateCode: "CA",
  type: "DOMESTIC",
  zipCode: "95403"
}

const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  let actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

context('ProfileBanner', () => {
  let component: any
  let store: any
  let testInstance: ReactTestInstance


  const prepInstanceWithStore = () => {
    store = mockStore({
      ...InitialState,
    })

    act(() => {
      component = renderWithProviders(
        <AddressValidation addressLine1={mockAddress.addressLine1} city={mockAddress.city} state={mockAddress.stateCode} zipCode={mockAddress.zipCode} addressId={12345}  />, store
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

})
