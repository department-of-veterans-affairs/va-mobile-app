import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import { StackNavigationOptions } from '@react-navigation/stack/lib/typescript/src/types'

import { context, findByTypeWithText, mockNavProps, mockStore, renderWithProviders } from 'testUtils'
import EditDraft from './EditDraft'
import { Linking, Pressable, TouchableWithoutFeedback } from 'react-native'
import { AlertBox, ErrorComponent, FormWrapper, LoadingComponent, TextView, VAModalPicker, VATextInput } from 'components'
import { initializeErrorsByScreenID, InitialState } from 'store/reducers'
import { CategoryTypeFields, ScreenIDTypesConstants, SecureMessagingMessageMap, SecureMessagingThreads } from 'store/api/types'
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

// Contains message Ids grouped together by thread
const mockThreads: Array<Array<number>> = [[1, 2, 3], [45]]

// Contains message attributes mapped to their ids
const mockMessages: SecureMessagingMessageMap = {
  1: {
    messageId: 1,
    category: CategoryTypeFields.other,
    subject: 'mock subject 1: The initial message sets the overall thread subject header',
    body: 'message 1 body text',
    attachment: false,
    sentDate: '1',
    senderId: 2,
    senderName: 'mock sender 1',
    recipientId: 3,
    recipientName: 'mock recipient name 1',
    readReceipt: 'mock read receipt 1',
  },
  2: {
    messageId: 2,
    category: CategoryTypeFields.other,
    subject: '',
    body: 'test 2',
    attachment: false,
    sentDate: '2',
    senderId: 2,
    senderName: 'mock sender 2',
    recipientId: 3,
    recipientName: 'mock recipient name 2',
    readReceipt: 'mock read receipt 2',
  },
  3: {
    messageId: 3,
    category: CategoryTypeFields.other,
    subject: '',
    body: 'Last accordion collapsible should be open, so the body text of this message should display',
    attachment: false,
    sentDate: '3',
    senderId: 2,
    senderName: 'mock sender 3',
    recipientId: 3,
    recipientName: 'mock recipient name 3',
    readReceipt: 'mock read receipt',
  },
  45: {
    messageId: 45,
    category: CategoryTypeFields.other,
    subject: 'This message should not display because it has different thread ID',
    body: 'test',
    attachment: false,
    sentDate: '1-1-21',
    senderId: 2,
    senderName: 'mock sender 45',
    recipientId: 3,
    recipientName: 'mock recipient name',
    readReceipt: 'mock read receipt',
  },
}

context('EditDraft', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any
  let goBack: jest.Mock
  let store: any
  let navHeaderSpy: any

  const initializeTestInstance = ({
    screenID = ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID,
    noRecipientsReturned = false,
    sendMessageFailed = false,
    hasLoadedRecipients = true,
    loading = false,
    threads = mockThreads,
    messageID = 2,
  }) => {
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
      { params: { attachmentFileToAdd: {}, messageID } },
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
        loading,
        messagesById: mockMessages,
        threads,
      },
      errors: {
        ...InitialState.errors,
        errorsByScreenID,
      },
    })

    act(() => {
      component = renderWithProviders(<EditDraft {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance({})
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when no recipients are returned', () => {
    beforeEach(() => {
      // need to use a different screenID otherwise useError will render the error component instead
      initializeTestInstance({
        noRecipientsReturned: true,
        messageID: 45,
      })
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
      initializeTestInstance({ loading: true })
      expect(testInstance.findAllByType(LoadingComponent).length).toEqual(1)
    })
  })

  describe('when there is an error', () => {
    it('should display the ErrorComponent', async () => {
      initializeTestInstance({ screenID: ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID })
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
      expect(
        findByTypeWithText(
          testInstance,
          TextView,
          'It can take up to three business days to receive a response from a member of your health care team or the administrative VA staff member you contacted.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when pressing the back button', () => {
    it('should ask for confirmation if any field filled in', async () => {
      act(() => {
        testInstance.findAllByType(VATextInput)[0].props.onChange('Random string')
      })
      navHeaderSpy.back.props.onPress()
      expect(goBack).not.toHaveBeenCalled()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('on click of save (draft)', () => {
    describe('when form fields are filled out correctly and saved', () => {
      it('should call saveDraft', async () => {
        navHeaderSpy.save.props.onSave()
        testInstance.findByType(FormWrapper).props.onSave(true)
        expect(saveDraft).toHaveBeenCalledWith(expect.objectContaining({ draft_id: expect.any(Number) }), expect.anything(), expect.anything())
      })
    })
  })

  describe('when form fields are filled out correctly and saved', () => {
    it('should call mockNavigationSpy', async () => {
      navHeaderSpy.save.props.onSave()
      testInstance.findByType(FormWrapper).props.onSave(true)
      expect(saveDraft).toHaveBeenCalled()
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
      initializeTestInstance({ sendMessageFailed: true })
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
