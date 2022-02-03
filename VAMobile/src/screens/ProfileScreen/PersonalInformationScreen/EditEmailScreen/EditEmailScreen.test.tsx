import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, findByTypeWithText, mockNavProps, mockStore, render, RenderAPI, waitFor } from 'testUtils'
import EditEmailScreen from './EditEmailScreen'
import { TextInput } from 'react-native'
import Mock = jest.Mock
import { ErrorsState, initialErrorsState, initializeErrorsByScreenID, InitialState } from 'store/slices'
import { CommonErrorTypesConstants } from 'constants/errors'
import { AlertBox, ErrorComponent, TextView, VAButton } from 'components'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { StackNavigationOptions } from '@react-navigation/stack/lib/typescript/src/types'
import { deleteEmail, updateEmail } from 'store/slices'

jest.mock('../../../../utils/hooks', () => {
  let original = jest.requireActual('../../../../utils/hooks')
  let theme = jest.requireActual('../../../../styles/themes/standardTheme').default

  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
  }
})

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    updateEmail: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
    deleteEmail: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

context('EditEmailScreen', () => {
  let store: any
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onBackSpy: Mock
  let props: any
  let navHeaderSpy: any

  const prepTestInstanceWithStore = (storeProps?: any, errorsState: ErrorsState = initialErrorsState) => {
    if (!storeProps) {
      storeProps = { emailSaved: false, loading: false }
    }

    onBackSpy = jest.fn(() => {})

    store ={
      ...InitialState,
      personalInformation: { ...InitialState.personalInformation, ...storeProps },
      errors: errorsState,
    }

    props = mockNavProps(
      {},
      {
        navigate: jest.fn(),
        goBack: onBackSpy,
        setOptions: (options: Partial<StackNavigationOptions>) => {
          navHeaderSpy = {
            back: options.headerLeft ? options.headerLeft({}) : undefined,
            save: options.headerRight ? options.headerRight({}) : undefined,
          }
        },
      },
    )

    component = render(<EditEmailScreen {...props} />, { preloadedState: store })

    testInstance = component.container
  }

  beforeEach(() => {
    prepTestInstanceWithStore()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should initialize the text input with the current email', async () => {
    prepTestInstanceWithStore({ emailSaved: false, loading: false, profile: { contactEmail: { emailAddress: 'my@email.com', id: '0' } } })

    const input = testInstance.findByType(TextInput)
    expect(input.props.value).toEqual('my@email.com')
  })

  it('should go back when the email is saved', async () => {
    prepTestInstanceWithStore({ emailSaved: true, loading: false })
    expect(onBackSpy).toHaveBeenCalled()
  })

  describe('when the email does not have an @ followed by text on save', () => {
    it('should display an alertbox and field error', async () => {
      prepTestInstanceWithStore({ emailSaved: false, loading: false, profile: { contactEmail: { emailAddress: 'my', id: '0' } } })

      await waitFor(() => {
        navHeaderSpy.save.props.onSave()
      })

      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      expect(findByTypeWithText(testInstance, TextView, 'Enter your email address again using this format: X@X.com')).toBeTruthy()
    })
  })

  describe('when the email input is empty on save', () => {
    it('should display an alertbox and field error', async () => {
      prepTestInstanceWithStore({ emailSaved: false, loading: false, profile: { contactEmail: { emailAddress: '', id: '0' } } })

      await waitFor(() => {
        navHeaderSpy.save.props.onSave()
      })

      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Enter your email address again using this format: X@X.com')
    })
  })

  describe('on click of save for a valid email', () => {
    it('should call updateEmail', async () => {
      prepTestInstanceWithStore({ emailSaved: false, loading: false, profile: { contactEmail: { emailAddress: 'my@email.com', id: '0' } } })

      await waitFor(() => {
        navHeaderSpy.save.props.onSave()
      })

      expect(updateEmail).toHaveBeenCalledWith('my@email.com', '0', 'EDIT_EMAIL_SCREEN')
    })
  })

  describe('when there is an existing email', () => {
    it('should display the remove button', () => {
      prepTestInstanceWithStore({ emailSaved: false, loading: false, profile: { contactEmail: { emailAddress: 'my@email.com', id: '0' } } })
      const buttons = testInstance.findAllByType(VAButton)
      expect(buttons[buttons.length - 1].props.label).toEqual('Remove Email Address')
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.EDIT_EMAIL_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      prepTestInstanceWithStore(undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      prepTestInstanceWithStore(undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})
