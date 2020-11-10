import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'
import EditEmailScreen, { isEmailValid } from "./EditEmailScreen";
import {TextInput} from "react-native";
import Mock = jest.Mock;
import { InitialState } from 'store/reducers'
import { finishEditEmail, updateTabBarVisible } from 'store/actions'
import {StackNavigationOptions} from "@react-navigation/stack/lib/typescript/src/types";

jest.mock('../../../../store/actions', () => {
  let actual = jest.requireActual('../../../../store/actions')
  return {
    ...actual,
    updateTabBarVisible: jest.fn(() => {
      return {
        type: '',
        payload: ''
      }
    }),
    finishEditEmail: jest.fn(() => {
      return {
        type: '',
        payload: ''
      }
    }),
  }
})

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
  let testInstance: ReactTestInstance
  let onBackSpy: Mock
  let props: any
  let navHeaderSpy: any

  const prepTestInstanceWithStore = (storeProps?: any) => {
    if (!storeProps) {
      storeProps = { emailSaved: false, loading: false }
    }

    onBackSpy = jest.fn(() => {})

    store = mockStore({
      ...InitialState,
      personalInformation: { ...InitialState.personalInformation, ...storeProps }
    })

    props = mockNavProps(
      {},
      {
        navigate: jest.fn(),
        goBack: onBackSpy,
        setOptions: (options: Partial<StackNavigationOptions>) => {
          navHeaderSpy = {
            back: options.headerLeft ? options.headerLeft({}) : undefined,
            save: options.headerRight ? options.headerRight({}) : undefined
          }
        },
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

  it('should call updateTabBarVisible with false', async () => {
    expect(updateTabBarVisible).toHaveBeenNthCalledWith(1, false)
  })

  it('should initialize the text input with the current email', async () => {
    prepTestInstanceWithStore({ emailSaved: true, loading: false, profile: { email: 'my@email.com' } })

    const input = testInstance.findByType(TextInput)
    expect(input.props.value).toEqual('my@email.com')
  })

  it('should validate empty emails or emails in the form of X@X', async () => {
    expect(isEmailValid('')).toBe(true)
    expect(isEmailValid('stuff@email.com')).toBe(true)
    expect(isEmailValid('@email.com')).toBe(false)
    expect(isEmailValid('stuff@')).toBe(false)
    expect(isEmailValid('randomtext')).toBe(false)
  })

  describe('when emailSaved is true', () => {
    it('should call navigation goBack, finishEditEmail, and updateTabBarVisible with true', async () => {
      prepTestInstanceWithStore({ emailSaved: true, loading: false })
      expect(onBackSpy).toHaveBeenCalled()
      expect(finishEditEmail).toBeCalled()
      expect(updateTabBarVisible).lastCalledWith(true)
    })
  })

  describe('when back button is pressed', () => {
    it('should call navigation goBack and updateTabBarVisible with true', async () => {
      navHeaderSpy.back.props.onPress()
      expect(onBackSpy).toBeCalled()
      expect(updateTabBarVisible).lastCalledWith(true)
    })
  })
})
