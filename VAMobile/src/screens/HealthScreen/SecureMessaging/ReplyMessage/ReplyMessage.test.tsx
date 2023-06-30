import 'react-native'
import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import { StackNavigationOptions } from '@react-navigation/stack/lib/typescript/src/types'

import { context, findByTypeWithSubstring, findByTypeWithText, mockNavProps, render, RenderAPI, waitFor } from 'testUtils'
import ReplyMessage from './ReplyMessage'
import { CategoryTypeFields, SecureMessagingMessageMap, SecureMessagingThreads } from 'store/api/types'
import { initialAuthState, initialErrorsState, initialSecureMessagingState, saveDraft } from 'store/slices'
import { AccordionCollapsible, AlertBox, FormWrapper, LoadingComponent, TextView } from 'components'
import { Pressable, TouchableWithoutFeedback } from 'react-native'
import { isIOS } from '../../../../utils/platform'
import { when } from 'jest-when'
import { FormHeaderTypeConstants } from 'constants/secureMessaging'

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    saveDraft: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native')
  RN.InteractionManager.runAfterInteractions = (callback: () => void) => {
    callback()
  }

  return RN
})

let mockUseComposeCancelConfirmationSpy = jest.fn()
jest.mock('../CancelConfirmations/ComposeCancelConfirmation', () => {
  let original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useComposeCancelConfirmation: () => [false, mockUseComposeCancelConfirmationSpy],
  }
})

let mockIsIOS = jest.fn()
jest.mock('utils/platform', () => ({
  isIOS: jest.fn(() => mockIsIOS),
}))

// Contains message Ids grouped together by thread
const mockThreads: Array<Array<number>> = [[1, 2, 3], [45]]

// Contains message attributes mapped to their ids
const mockMessagesById: SecureMessagingMessageMap = {
  1: {
    messageId: 1,
    category: CategoryTypeFields.other,
    subject: 'mock subject 1: The initial message sets the overall thread subject header',
    body: 'message 1 body text',
    hasAttachments: false,
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
    hasAttachments: false,
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
    hasAttachments: false,
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
    hasAttachments: false,
    sentDate: '1-1-21',
    senderId: 2,
    senderName: 'mock sender 45',
    recipientId: 3,
    recipientName: 'mock recipient name',
    readReceipt: 'mock read receipt',
  },
}

context('ReplyMessage', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any
  let goBack: jest.Mock
  let isIOSMock = isIOS as jest.Mock
  let navHeaderSpy: any
  let navigateToVeteranCrisisLineSpy: jest.Mock
  let navigateToAttachmentsSpy: jest.Mock
  let navigateToAttachmentsFAQSpy: jest.Mock
  let navigateToReplyHelpSpy: jest.Mock

  const initializeTestInstance = (
    mockMessagesById: SecureMessagingMessageMap,
    threadList: SecureMessagingThreads,
    loading: boolean = false,
    sendMessageFailed: boolean = false,
  ) => {
    goBack = jest.fn()
    navigateToVeteranCrisisLineSpy = jest.fn()
    navigateToAttachmentsSpy = jest.fn()
    navigateToAttachmentsFAQSpy = jest.fn()
    navigateToReplyHelpSpy = jest.fn()

    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('VeteransCrisisLine')
      .mockReturnValue(navigateToVeteranCrisisLineSpy)
      .calledWith('Attachments', { origin: FormHeaderTypeConstants.reply, attachmentsList: [], messageID: 3 })
      .mockReturnValue(navigateToAttachmentsSpy)
      .calledWith('AttachmentsFAQ', { originHeader: 'Reply' })
      .mockReturnValue(navigateToAttachmentsFAQSpy)
      .calledWith('ReplyHelp')
      .mockReturnValue(navigateToReplyHelpSpy)

    isIOSMock.mockReturnValue(false)

    props = mockNavProps(
      undefined,
      {
        addListener: mockUseComposeCancelConfirmationSpy,
        goBack,
        setOptions: (options: Partial<StackNavigationOptions>) => {
          navHeaderSpy = {
            back: options.headerLeft ? options.headerLeft({}) : undefined,
            save: options.headerRight ? options.headerRight({}) : undefined,
          }
        },
      },
      { params: { messageID: 3, attachmentFileToAdd: {} } },
    )

    component = render(<ReplyMessage {...props} />, {
      preloadedState: {
        auth: { ...initialAuthState },
        secureMessaging: {
          ...initialSecureMessagingState,
          loading: loading,
          messagesById: mockMessagesById,
          threads: threadList,
          sendMessageFailed: sendMessageFailed,
        },
        errors: initialErrorsState,
      },
    })

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance(mockMessagesById, mockThreads)
  })

  it('initializes correctly', async () => {
    await waitFor(() => {
      expect(component).toBeTruthy()
    })
  })

  describe('on click of the crisis line banner', () => {
    it('should call useRouteNavigation', async () => {
      await waitFor(() => {
        testInstance.findAllByType(TouchableWithoutFeedback)[2].props.onPress()
        expect(navigateToVeteranCrisisLineSpy).toHaveBeenCalled()
      })
    })
  })

  describe('on click of the collapsible view', () => {

    it('should show the Reply Help panel', async () => {
      await waitFor(() => {
        testInstance.findByProps({ accessibilityLabel: 'Only use messages for non-urgent needs' }).props.onPress()
      })
      expect(navigateToReplyHelpSpy).toHaveBeenCalled()
    })
  })

  it('should add the text (*Required) for the message body text field', async () => {
    await waitFor(() => {
      expect(screen.getByText('Message (Required)')).toBeTruthy()
    })
  })

  describe('on click of save (draft)', () => {
    beforeEach(async () => {
      await waitFor(() => {
        navHeaderSpy.save.props.onSave()

        testInstance.findByType(FormWrapper).props.onSave(true)
      })
    })
    describe('when a required field is not filled', () => {
      it('should display a field error for that field', async () => {
        await waitFor(() => {
          expect(findByTypeWithText(testInstance, TextView, 'Enter a message')).toBeTruthy()
        })
      })

      it('should display an AlertBox', async () => {
        await waitFor(() => {
          expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
          expect(findByTypeWithText(testInstance, TextView, 'We need more information')).toBeTruthy()
          expect(findByTypeWithSubstring(testInstance, TextView, 'To save this message, provide this information:')).toBeTruthy()
        })
      })
    })

    describe('when form fields are filled out correctly and saved', () => {
      it('should call saveDraft', async () => {
        await waitFor(() => {
          testInstance.findByType(FormWrapper).props.onSave(true)
          expect(saveDraft).toHaveBeenCalled()
        })
      })
    })
  })

  describe('on click of send', () => {
    describe('when a required field is not filled', () => {
      beforeEach(async () => {
        await waitFor(() => {
          act(() => {
            testInstance.findByProps({ label: 'Send' }).props.onPress()
          })
        })
      })

      it('should display a field error for that field', async () => {
        await waitFor(() => {
          expect(findByTypeWithText(testInstance, TextView, 'Enter a message')).toBeTruthy()
        })
      })
      it('should display an AlertBox', async () => {
        await waitFor(() => {
          expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
          expect(findByTypeWithText(testInstance, TextView, 'We need more information')).toBeTruthy()
          expect(findByTypeWithSubstring(testInstance, TextView, 'To send this message, provide this information:')).toBeTruthy()
        })
      })
    })
  })

  it('should render the correct number of accordions', async () => {
    expect(screen.getAllByRole('tab').length).toBe(3)
    expect(screen.getByText('mock sender 1')).toBeTruthy()
    expect(screen.getByText('mock sender 2')).toBeTruthy()
    expect(screen.getAllByText('mock sender 3').length).toBe(2)
    expect(screen.queryByText('mock sender 45')).toBeFalsy()
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(mockMessagesById, [], true)
      await waitFor(() => {
        expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
      })
    })
  })

  describe('on click of add files button', () => {
    it('should call useRouteNavigation', async () => {
      await waitFor(() => {
        testInstance.findByProps({ label: 'Add Files' }).props.onPress()
        expect(navigateToAttachmentsSpy).toHaveBeenCalled()
      })
    })
  })
})
