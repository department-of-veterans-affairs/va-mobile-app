import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act } from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import EditPhoneNumberScreen from './EditPhoneNumberScreen'

jest.mock("../../../../utils/hooks", ()=> {
  let theme = jest.requireActual("../../../../styles/themes/standardTheme").default
  return {
    useTranslation: () => jest.fn(),
    useTheme: jest.fn(()=> {
      return {...theme}
    })
  }
})

context('EditPhoneNumberScreen', () => {
  let store: any
  let component: any

  beforeEach(() => {
    const props = mockNavProps(
      {},
      {
        navigate: jest.fn(),
        setOptions: jest.fn(),
      },
      {
        params: {
          displayTitle: 'Home phone',
          phoneType: 'HOME',
        },
      },
    )

    store = mockStore({
      auth: { initializing: true, loggedIn: false, loading: false, emailSaved: false },
    })

    act(() => {
      component = renderWithProviders(<EditPhoneNumberScreen {...props} />, store)
    })
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
