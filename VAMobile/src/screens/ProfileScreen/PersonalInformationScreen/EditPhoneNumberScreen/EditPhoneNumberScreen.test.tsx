import 'react-native'
import React from 'react'
import {TextInput} from 'react-native'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { StackNavigationOptions } from '@react-navigation/stack/lib/typescript/src/types'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import EditPhoneNumberScreen from './EditPhoneNumberScreen'
import { ErrorsState, initialErrorsState, InitialState } from 'store/reducers'
import { PhoneData } from 'store/api/types'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { ErrorComponent } from 'components'

jest.mock("../../../../utils/hooks", ()=> {
  let original = jest.requireActual("../../../../utils/hooks")
  let theme = jest.requireActual("../../../../styles/themes/standardTheme").default

  return {
    ...original,
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
  let navHeaderSpy: any

  const initializeTestInstance = (phoneData: PhoneData, errorsState: ErrorsState = initialErrorsState) => {
    props = mockNavProps(
      {},
      {
        navigate: jest.fn(),
        setOptions: (options: Partial<StackNavigationOptions>) => {
          navHeaderSpy = {
            back: options.headerLeft ? options.headerLeft({}) : undefined,
            save: options.headerRight ? options.headerRight({}) : undefined
          }
        },
        goBack: jest.fn()
      },
      {
        params: {
          displayTitle: 'Home phone',
          phoneType: 'HOME',
          phoneData
        },
      },
    )

    store = mockStore({
      ...InitialState,
      errors: errorsState
    })

    act(() => {
      component = renderWithProviders(<EditPhoneNumberScreen {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance({
      id: 0,
      areaCode: '858',
      phoneNumber: '1234567',
      countryCode: '1',
      phoneType: 'HOME'
    })
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

  describe('when phoneNumberSaved is true', () => {
    it('should call navigations go back function', async () => {
      store = mockStore({
        ...InitialState,
        personalInformation: { ...InitialState.personalInformation, phoneNumberSaved: true }
      })

      act(() => {
        component = renderWithProviders(<EditPhoneNumberScreen {...props} />, store)
      })

      testInstance = component.root

      expect(props.navigation.goBack).toBeCalled()
    })
  })

  describe('when both phone number and extension fields are empty', () => {
    it('should enable the save button', async () => {
      initializeTestInstance({
        id: 0,
        areaCode: '',
        phoneNumber: '',
        countryCode: '',
        phoneType: 'HOME'
      })

      expect(navHeaderSpy.save.props.disabled).toEqual(false)
    })
  })

  describe('when the phone number has 10 digits', () => {
    it('should enable the save button', async () => {
      initializeTestInstance({
        id: 0,
        areaCode: '858',
        phoneNumber: '1234567',
        countryCode: '1',
        phoneType: 'HOME'
      })

      expect(navHeaderSpy.save.props.disabled).toEqual(false)

    })
  })

  describe('when the phone number is not 0 or 10 digits', () => {
    it('should disable the save button', async () => {
      initializeTestInstance({
        id: 0,
        areaCode: '858',
        phoneNumber: '123',
        countryCode: '1',
        phoneType: 'HOME'
      })

      expect(navHeaderSpy.save.props.disabled).toEqual(true)
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: ScreenIDTypesConstants.EDIT_PHONE_NUMBER_SCREEN_ID,
        errorType: CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance({
        id: 0,
        areaCode: '858',
        phoneNumber: '123',
        countryCode: '1',
        phoneType: 'HOME'
      }, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: undefined,
        errorType: CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance({
        id: 0,
        areaCode: '858',
        phoneNumber: '123',
        countryCode: '1',
        phoneType: 'HOME'
      }, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})
