import 'react-native'
import React from 'react'
import {TextInput} from 'react-native'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import {context, findByTestID, mockNavProps, mockStore, renderWithProviders} from 'testUtils'

import EditPhoneNumberScreen from './EditPhoneNumberScreen'
import SaveButton from 'components/SaveButton'

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
      auth: { initializing: true, loggedIn: false, loading: false },
    })

    act(() => {
      component = renderWithProviders(<EditPhoneNumberScreen {...props} />, store)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the save button has been clicked', () => {
    it('should edit the phone number in the store', async () => {

    })
  })

  describe('when the text input changes', () => {
    describe('when the length is less than or equal to 10 digits', () => {
      it('should display just the numbers in the text input', async() => {
        const phoneNumTextInput = testInstance.findAllByType(TextInput)[0]
        phoneNumTextInput.props.onChangeText('12345')
        expect(phoneNumTextInput.props.value).toEqual('12345')
      })
    })

    describe('when the length is 0 or more than 10', () => {
      it('should enable the save button', async() => {
        const phoneNumTextInput = testInstance.findAllByType(TextInput)[0]
        phoneNumTextInput.props.onChangeText('')
       // const saveButton = testInstance.findByType(SaveButton)
       // expect(saveButton.props.disabled).toEqual(false)

        phoneNumTextInput.props.onChangeText('123456789000')
       // expect(saveButton.props.disabled).toEqual(false)
      })
    })

    describe('when the length is not 0 or more than 10', () => {
      it('should disable the save button', async() => {
        const phoneNumTextInput = testInstance.findAllByType(TextInput)[0]
        phoneNumTextInput.props.onChangeText('12345')
       // const saveButton = testInstance.findByType(SaveButton)
       // expect(saveButton.props.disabled).toEqual(true)
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
})
