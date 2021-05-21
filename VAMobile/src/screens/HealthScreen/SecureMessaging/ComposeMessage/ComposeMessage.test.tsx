import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import ComposeMessage from './ComposeMessage'
import {Pressable, TouchableWithoutFeedback} from 'react-native'
import {
  AlertBox,
  ErrorComponent,
  FormWrapper,
  LoadingComponent,
  TextView,
  VAModalPicker,
} from 'components'
import {initializeErrorsByScreenID, InitialState} from 'store/reducers'
import {CategoryTypeFields, ScreenIDTypesConstants} from 'store/api/types'
import {updateSecureMessagingTab} from 'store/actions'
import {CommonErrorTypesConstants} from 'constants/errors'

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual("utils/hooks")
  let theme = jest.requireActual("styles/themes/standardTheme").default
  return {
    ...original,
    useTheme: jest.fn(()=> {
      return {...theme}
    }),
    useRouteNavigation: () => { return () => mockNavigationSpy},
  }
})

jest.mock('store/actions', () => {
  let actual = jest.requireActual('store/actions')
  return {
    ...actual,
    updateSecureMessagingTab: jest.fn(() => {
      return {
        type: '',
        payload: ''
      }
    }),
  }
})


context('ComposeMessage', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any
  let goBack: jest.Mock
  let store: any

  const initializeTestInstance = (loadingRecipients = false, screenID = ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID, noRecipientsReturned = false) => {
    goBack = jest.fn()
    const errorsByScreenID = initializeErrorsByScreenID()
    errorsByScreenID[screenID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

    props = mockNavProps(undefined, { setOptions: jest.fn(), goBack }, { params: { attachmentFileToAdd: {} } })

    store = mockStore({
      ...InitialState,
      secureMessaging: {
        ...InitialState.secureMessaging,
        loadingRecipients,
        recipients: noRecipientsReturned ? [] : [
          {
            id: 'id',
            type: 'type',
            attributes: {
              triageTeamId: 0,
              name: 'Doctor 1',
              relationType: 'PATIENT'
            }
          },
          {
            id: 'id2',
            type: 'type',
            attributes: {
              triageTeamId: 1,
              name: 'Doctor 2',
              relationType: 'PATIENT'
            }
          }
        ]
      },
      errors: {
        ...InitialState.errors,
        errorsByScreenID
      }
    })

    act(() => {
      component = renderWithProviders(<ComposeMessage {...props}/>, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when no recipients are returned', () => {
    beforeEach(() => {
      initializeTestInstance(false, ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID, true)
    })

    it('should display an AlertBox', async () => {
      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
    })

    describe('on click of the go to inbox button', () => {
      it('should call useRouteNavigation and updateSecureMessagingTab', async () => {
        testInstance.findByProps({ label: 'Go to Inbox' }).props.onPress()
        expect(mockNavigationSpy).toHaveBeenCalled()
        expect(updateSecureMessagingTab).toHaveBeenCalled()
      })
    })
  })

  describe('when the loadingRecipients is true', () => {
    it('should display the LoadingComponent', () => {
      initializeTestInstance(true)
      expect(testInstance.findAllByType(LoadingComponent).length).toEqual(1)
    })
  })

  describe('when there is an error', () => {
    it('should display the ErrorComponent', async () => {
      initializeTestInstance(false, ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID)
      expect(testInstance.findAllByType(ErrorComponent).length).toEqual(1)
    })
  })

  describe('on click of the crisis line banner', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findByType(TouchableWithoutFeedback).props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('on click of the collapsible view', () => {
    it('should display the when will i get a reply children text', async () => {
      testInstance.findAllByType(Pressable)[0].props.onPress()
      expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('It can take up to three business days to receive a response from a member of your health care team or the administrative VA staff member you contacted.')
    })
  })

  describe('when the subject is general', () => {
    it('should add the text (*Required) for the subject line field', async () => {
      act(() => {
        testInstance.findAllByType(VAModalPicker)[1].props.onSelectionChange(CategoryTypeFields.other)
      })

      const textViews = testInstance.findAllByType(TextView)
      expect(textViews[29].props.children).toEqual('Subject Line')
      expect(textViews[30].props.children).toEqual(' ')
      expect(textViews[31].props.children).toEqual('(*Required)')
    })
  })

  describe('on click of the cancel button', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findByProps({ label: 'Cancel' }).props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('on click of send', () => {
    describe('when a required field is not filled', () => {
      beforeEach(() => {
        act(() => {
          testInstance.findByProps({ label: 'Send' }).props.onPress()
        })
      })

      it('should display a field error for that field', async () => {
        const textViews = testInstance.findAllByType(TextView)
        expect(textViews[16].props.children).toEqual('To is required')
        expect(textViews[31].props.children).toEqual('Subject is required')
        expect(textViews[40].props.children).toEqual('The message cannot be blank')
      })

      it('should display an AlertBox', async () => {
        expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      })
    })
  })

  describe('when form fields are filled out correctly and saved', () => {
    it('should call mockNavigationSpy', async () => {
        testInstance.findByType(FormWrapper).props.onSave(true)
        expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('when the subject changes from general to another option', () => {
    it('should clear all field errors', async () => {
      act(() => {
        testInstance.findByProps({ label: 'Send' }).props.onPress()
      })

      let textViews = testInstance.findAllByType(TextView)
      expect(textViews[16].props.children).toEqual('To is required')
      expect(textViews[31].props.children).toEqual('Subject is required')
      expect(textViews[40].props.children).toEqual('The message cannot be blank')

      act(() => {
        testInstance.findAllByType(VAModalPicker)[1].props.onSelectionChange(CategoryTypeFields.other)
      })

      act(() => {
        testInstance.findAllByType(VAModalPicker)[1].props.onSelectionChange(CategoryTypeFields.covid)
      })

      textViews = testInstance.findAllByType(TextView)
      expect(textViews[14].props.children).toEqual('')
      expect(textViews[31].props.children).toEqual('Attachments')
    })
  })

  describe('on click of add files button', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findByProps({ label: 'Add files' }).props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('on click of the "How to attach a file" link', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findByProps({variant: 'HelperText', color:'link'}).props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })
})
