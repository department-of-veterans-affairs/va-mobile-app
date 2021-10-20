import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import { StackNavigationOptions } from '@react-navigation/stack/lib/typescript/src/types'

import { context, findByTypeWithText, mockNavProps, mockStore, renderWithProviders } from 'testUtils'
import ComposeMessage from './ComposeMessage'
import { Linking, Pressable, TouchableWithoutFeedback } from 'react-native'
import { AlertBox, ErrorComponent, FormWrapper, LoadingComponent, TextView, VAModalPicker, VATextInput } from 'components'
import { initializeErrorsByScreenID, InitialState } from 'store/reducers'
import { CategoryTypeFields, ScreenIDTypesConstants } from 'store/api/types'
import { saveDraft, updateSecureMessagingTab } from 'store/actions'
import { CommonErrorTypesConstants } from 'constants/errors'

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  let theme = jest.requireActual('styles/themes/standardTheme').default
  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
    useRouteNavigation: () => {
      return () => mockNavigationSpy
    },
  }
})

jest.mock('store/actions', () => {
  let actual = jest.requireActual('store/actions')
  return {
    ...actual,
    updateSecureMessagingTab: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
    saveDraft: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

let mockUseComposeCancelConfirmationSpy = jest.fn()
jest.mock('../CancelConfirmations/ComposeCancelConfirmation', () => {
  let original = jest.requireActual('utils/hooks')
  let theme = jest.requireActual('styles/themes/standardTheme').default
  return {
    ...original,
    useComposeCancelConfirmation: () => mockUseComposeCancelConfirmationSpy
  }
})

context('ComposeMessage', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any
  let goBack: jest.Mock
  let store: any
  let navHeaderSpy: any

  const initializeTestInstance = (
    screenID = ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID,
    noRecipientsReturned = false,
    sendMessageFailed: boolean = false,
    hasLoadedRecipients: boolean = true,
    params: Object = { attachmentFileToAdd: {} },
  ) => {
    goBack = jest.fn()
    const errorsByScreenID = initializeErrorsByScreenID()
    errorsByScreenID[screenID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

    props = mockNavProps(
      undefined,
      {
        navigate: mockNavigationSpy,
        goBack,
        setOptions: (options: Partial<StackNavigationOptions>) => {
          navHeaderSpy = {
            back: options.headerLeft ? options.headerLeft({}) : undefined,
            save: options.headerRight ? options.headerRight({}) : undefined,
          }
        },
      },
      { params: params },
    )

    store = mockStore({
      ...InitialState,
      secureMessaging: {
        ...InitialState.secureMessaging,
        sendMessageFailed: sendMessageFailed,
        recipients: noRecipientsReturned
          ? []
          : [
              {
                id: 'id',
                type: 'type',
                attributes: {
                  triageTeamId: 0,
                  name: 'Doctor 1',
                  relationType: 'PATIENT',
                },
              },
              {
                id: 'id2',
                type: 'type',
                attributes: {
                  triageTeamId: 1,
                  name: 'Doctor 2',
                  relationType: 'PATIENT',
                },
              },
            ],
        hasLoadedRecipients,
      },
      errors: {
        ...InitialState.errors,
        errorsByScreenID,
      },
    })

    act(() => {
      component = renderWithProviders(<ComposeMessage {...props} />, store)
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
      // need to use a different screenID otherwise useError will render the error component instead
      initializeTestInstance(ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID, true, false, true)
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

  describe('when hasLoadedRecipients is false', () => {
    it('should display the LoadingComponent', () => {
      initializeTestInstance(ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID, true, false, false)
      expect(testInstance.findAllByType(LoadingComponent).length).toEqual(1)
    })
  })

  describe('when there is an error', () => {
    it('should display the ErrorComponent', async () => {
      initializeTestInstance(ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID)
      expect(testInstance.findAllByType(ErrorComponent).length).toEqual(1)
    })
  })

  describe('on click of the crisis line banner', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findByType(TouchableWithoutFeedback).props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('when returning from confirmation screen', () => {
    it('should show Recheck Info if validation had failed', async () => {
      initializeTestInstance(undefined, undefined, undefined, undefined, { saveDraftConfirmFailed: true })
      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      expect(findByTypeWithText(testInstance, TextView, 'Recheck information')).toBeTruthy()
    })
  })

  describe('on click of the collapsible view', () => {
    it('should display the when will i get a reply children text', async () => {
      act(() => {
        testInstance.findAllByType(Pressable)[0].props.onPress()
      })
      expect(
        findByTypeWithText(
          testInstance,
          TextView,
          'It can take up to three business days to receive a response from a member of your health care team or the administrative VA staff member you contacted.',
        ),
      ).toBeTruthy()
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

  describe('when pressing the back button', () => {
    it('should go to inbox if all fields empty', async () => {
      navHeaderSpy.back.props.onPress()
      expect(goBack).toHaveBeenCalled()
    })

    it('should ask for confirmation if any field filled in', async () => {
      act(() => {
        testInstance.findAllByType(VATextInput)[0].props.onChange('Random string')
      })
      navHeaderSpy.back.props.onPress()
      expect(goBack).not.toHaveBeenCalled()
      expect(mockUseComposeCancelConfirmationSpy).toHaveBeenCalled()
    })
  })

  describe('on click of save (draft)', () => {
    describe('when a required field is not filled', () => {
      beforeEach(() => {
        act(() => {
          navHeaderSpy.save.props.onSave()
        })
      })

      it('should display a field error for that field', async () => {
        expect(findByTypeWithText(testInstance, TextView, 'To is required')).toBeTruthy()
        expect(findByTypeWithText(testInstance, TextView, 'Subject is required')).toBeTruthy()
        expect(findByTypeWithText(testInstance, TextView, 'The message cannot be blank')).toBeTruthy()
      })

      it('should display an AlertBox', async () => {
        expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
        expect(findByTypeWithText(testInstance, TextView, 'Recheck information')).toBeTruthy()
        expect(findByTypeWithText(testInstance, TextView, 'In order to save this draft, all of the required fields must be filled.')).toBeTruthy()
      })
    })

    describe('when form fields are filled out correctly and saved', () => {
      it('should call saveDraft', async () => {
        act(() => {
          navHeaderSpy.save.props.onSave()
        })
        testInstance.findByType(FormWrapper).props.onSave(true)
        expect(saveDraft).toHaveBeenCalled()
      })
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
        expect(findByTypeWithText(testInstance, TextView, 'To is required')).toBeTruthy()
        expect(findByTypeWithText(testInstance, TextView, 'Subject is required')).toBeTruthy()
        expect(findByTypeWithText(testInstance, TextView, 'The message cannot be blank')).toBeTruthy()
      })

      it('should display an AlertBox', async () => {
        expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
        expect(findByTypeWithText(testInstance, TextView, 'Check your message')).toBeTruthy()
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
      expect(findByTypeWithText(testInstance, TextView, 'To is required')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Subject is required')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'The message cannot be blank')).toBeTruthy()

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
      testInstance.findByProps({ label: 'Add Files' }).props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('on click of the "How to attach a file" link', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findByProps({ variant: 'HelperText', color: 'link' }).props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('when message send fails', () => {
    beforeEach(() => {
      // Give a different screenID so it won't display the error screen instead
      initializeTestInstance(ScreenIDTypesConstants.CLAIM_DETAILS_SCREEN_ID, false, true)
    })

    it('should display error alert', async () => {
      expect(testInstance.findByType(AlertBox)).toBeTruthy()
    })
    describe('when the My HealtheVet phone number link is clicked', () => {
      it('should call Linking open url with the parameter tel:8773270022', async () => {
        testInstance.findAllByType(TouchableWithoutFeedback)[1].props.onPress()
        expect(Linking.openURL).toBeCalledWith('tel:8773270022')
      })
    })
    describe('when the call TTY phone link is clicked', () => {
      it('should call Linking open url with the parameter tel:711', async () => {
        testInstance.findAllByType(TouchableWithoutFeedback)[2].props.onPress()
        expect(Linking.openURL).toBeCalledWith('tel:711')
      })
    })
  })
})
