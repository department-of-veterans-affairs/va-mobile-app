import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act } from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'
import EditEmailScreen from "./EditEmailScreen";

jest.mock("../../../../utils/hooks", ()=> {
  let theme = jest.requireActual("../../../../styles/themes/standardTheme").default

  return {
    useTranslation: () => jest.fn(),
    useTheme: jest.fn(()=> {
      return {...theme}
    })
  }
})

context('EditEmailScreen', () => {
  let store: any
  let component: any

  beforeEach(() => {
    const props = mockNavProps(
      {},
      {
        navigate: jest.fn(),
        setOptions: jest.fn(),
      }
    )

    store = mockStore({
      auth: { initializing: true, loggedIn: true, loading: false },
      personalInformation: { emailSaved: false, loading: false }
    })

    act(() => {
      component = renderWithProviders(<EditEmailScreen {...props} />, store)
    })
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
