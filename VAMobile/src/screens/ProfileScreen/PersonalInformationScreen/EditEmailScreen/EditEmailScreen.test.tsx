import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'
import EditEmailScreen from "./EditEmailScreen";
import {TextInput} from "react-native";
import Mock = jest.Mock;
import { ErrorsState, initialErrorsState, InitialState } from 'store/reducers'
import { CommonErrorTypesConstants } from 'constants/errors'
import {AlertBox, ErrorComponent, TextView} from 'components'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import {StackNavigationOptions} from '@react-navigation/stack/lib/typescript/src/types'
import {updateEmail} from 'store/actions'

jest.mock("../../../../utils/hooks", ()=> {
  let original = jest.requireActual("../../../../utils/hooks")
  let theme = jest.requireActual("../../../../styles/themes/standardTheme").default

  return {
    ...original,
    useTheme: jest.fn(()=> {
      return {...theme}
    })
  }
})

jest.mock('../../../../store/actions', () => {
  let actual = jest.requireActual('../../../../store/actions')
  return {
    ...actual,
    updateEmail: jest.fn(() => {
      return {
        type: '',
        payload: ''
      }
    })
  }
})

let navHeaderSpy: any
jest.mock('@react-navigation/native', () => {
  let actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    useNavigation: () => ({
      setOptions: (options: Partial<StackNavigationOptions>) => {
        navHeaderSpy = {
          back: options.headerLeft ? options.headerLeft({}) : undefined,
          save: options.headerRight ? options.headerRight({}) : undefined
        }
      },
    }),
  };
});

context('EditEmailScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance
  let onBackSpy: Mock
  let props: any

  const prepTestInstanceWithStore = (storeProps?: any, errorsState: ErrorsState = initialErrorsState) => {
    if (!storeProps) {
      storeProps = { emailSaved: false, loading: false }
    }

    onBackSpy = jest.fn(() => {})

    store = mockStore({
      ...InitialState,
      personalInformation: { ...InitialState.personalInformation, ...storeProps },
      errors: errorsState
    })

    props = mockNavProps(
      {},
      {
        navigate: jest.fn(),
        goBack: onBackSpy,
      }
    )

    act(() => {
      component = renderWithProviders(<EditEmailScreen {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    prepTestInstanceWithStore()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should initialize the text input with the current email', async () => {
    prepTestInstanceWithStore({ emailSaved: false, loading: false, profile: { contactEmail: { emailAddress: 'my@email.com', id: '0' }, }})

    const input = testInstance.findByType(TextInput)
    expect(input.props.value).toEqual('my@email.com')
  })

  it('should go back when the email is saved', async () => {
    prepTestInstanceWithStore({ emailSaved: true, loading: false })
    expect(onBackSpy).toHaveBeenCalled()
  })

  describe('when the email does not have an @ followed by text on save', () => {
    it('should display an alertbox and field error', async () => {
      prepTestInstanceWithStore({ emailSaved: false, loading: false, profile: { contactEmail: { emailAddress: 'my', id: '0' }, }})
      navHeaderSpy.save.props.onSave()
      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Enter your email address again using this format: X@X.com')
    })
  })

  describe('when the email input is empty on save', () => {
    it('should display an alertbox and field error', async () => {
      prepTestInstanceWithStore({ emailSaved: false, loading: false, profile: { contactEmail: { emailAddress: '', id: '0' }, }})
      navHeaderSpy.save.props.onSave()
      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Enter your email address again using this format: X@X.com')
    })
  })

  describe('on click of save for a valid email', () => {
    it('should call updateEmail', async () => {
      prepTestInstanceWithStore({ emailSaved: false, loading: false, profile: { contactEmail: { emailAddress: 'my@email.com', id: '0' }, }})
      navHeaderSpy.save.props.onSave()
      expect(updateEmail).toHaveBeenCalledWith('my@email.com', '0', 'EDIT_EMAIL_SCREEN')
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: ScreenIDTypesConstants.EDIT_EMAIL_SCREEN_ID,
        errorType: CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      prepTestInstanceWithStore(undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: undefined,
        errorType: CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      prepTestInstanceWithStore(undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})
