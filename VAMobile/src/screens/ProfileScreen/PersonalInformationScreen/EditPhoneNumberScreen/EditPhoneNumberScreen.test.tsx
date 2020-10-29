import 'react-native'
import React from 'react'
import {TextInput} from 'react-native'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'

import EditPhoneNumberScreen from './EditPhoneNumberScreen'
import {InitialState} from 'store/reducers'

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
  let testInstance: ReactTestInstance
  let props: any

  beforeEach(() => {
    props = mockNavProps(
      {},
      {
        navigate: jest.fn(),
        setOptions: jest.fn(),
        goBack: jest.fn()
      },
      {
        params: {
          displayTitle: 'Home phone',
          phoneType: 'HOME',
        },
      },
    )

    store = mockStore({
      ...InitialState
    })

    act(() => {
      component = renderWithProviders(<EditPhoneNumberScreen {...props} />, store)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the text input changes', () => {
    describe('when the length is less than or equal to 10 digits', () => {
      it('should display just the numbers in the text input', async() => {
        const phoneNumTextInput = testInstance.findAllByType(TextInput)[0]
        phoneNumTextInput.props.onChangeText('12345')
        expect(phoneNumTextInput.props.value).toEqual('12345')
      })
    })

    describe('when the new text is greater than 10 digits', () => {
      it('will not update phoneNumber to the new value', async() => {
        const phoneNumTextInput = testInstance.findAllByType(TextInput)[0]
        phoneNumTextInput.props.onChangeText('12345')
        expect(phoneNumTextInput.props.value).toEqual('12345')

        phoneNumTextInput.props.onChangeText('123456789011')
        expect(phoneNumTextInput.props.value).toEqual('12345')
      })
    })
  })

  describe('when the text input has been edited', () => {
    describe('when there are 10 digits', () => {
      it('should set the value of the text input to the formatted number', async () => {
        const phoneNumTextInput = testInstance.findAllByType(TextInput)[0]
        phoneNumTextInput.props.onChangeText('1234567890')
        phoneNumTextInput.props.onEndEditing()
        expect(phoneNumTextInput.props.value).toEqual('(123)-456-7890')
      })
    })

    describe('when there are not 10 digits', () => {
      it('should set the value of the text input to the number', async () => {
        const phoneNumTextInput = testInstance.findAllByType(TextInput)[0]
        phoneNumTextInput.props.onChangeText('12345678')
        phoneNumTextInput.props.onEndEditing()
        expect(phoneNumTextInput.props.value).toEqual('12345678')
      })
    })
  })

  describe('when phoneNumberUpdated is true', () => {
    it('should call navigations go back function', async () => {
      store = mockStore({
        ...InitialState,
        personalInformation: { ...InitialState.personalInformation, phoneNumberUpdated: true }
      })

      act(() => {
        component = renderWithProviders(<EditPhoneNumberScreen {...props} />, store)
      })

      testInstance = component.root

      expect(props.navigation.goBack).toBeCalled()
    })
  })
})
