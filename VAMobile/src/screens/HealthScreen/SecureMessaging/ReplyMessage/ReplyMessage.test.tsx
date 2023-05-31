import 'react-native'
import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import { StackNavigationOptions } from '@react-navigation/stack/lib/typescript/src/types'

import { context, findByTypeWithText, mockNavProps, render, RenderAPI, waitFor } from 'testUtils'
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

    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('VeteransCrisisLine')
      .mockReturnValue(navigateToVeteranCrisisLineSpy)
      .calledWith('Attachments', { origin: FormHeaderTypeConstants.reply, attachmentsList: [], messageID: 3 })
      .mockReturnValue(navigateToAttachmentsSpy)
      .calledWith('AttachmentsFAQ', { originHeader: 'Reply' })
      .mockReturnValue(navigateToAttachmentsFAQSpy)

    isIOSMock.mockReturnValue(false)

    props = mockNavProps(
      undefined,
      {
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
    it('should display the when will i get a reply children text', async () => {
      waitFor(() => {
        testInstance.findAllByType(Pressable)[0].props.onPress()
        expect(screen.getByText('It can take up to three business days to receive a response from a member of your health care team or the administrative VA staff member you contacted.')).toBeTruthy()
      })
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
          expect(findByTypeWithText(testInstance, TextView, 'The message cannot be blank')).toBeTruthy()
        })
      })

      it('should display an AlertBox', async () => {
        await waitFor(() => {
          expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
          expect(findByTypeWithText(testInstance, TextView, 'Recheck information')).toBeTruthy()
          expect(findByTypeWithText(testInstance, TextView, 'In order to save this draft, all of the required fields must be filled.')).toBeTruthy()
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
          expect(findByTypeWithText(testInstance, TextView, 'The message cannot be blank')).toBeTruthy()
        })
      })
      it('should display an AlertBox', async () => {
        await waitFor(() => {
          expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
          expect(findByTypeWithText(testInstance, TextView, 'Check your message')).toBeTruthy()
        })
      })
    })
  })

  it('renders only messages in the same thread as the message associated with messageID', async () => {
    await waitFor(() => {
      expect(testInstance.findAllByType(AccordionCollapsible).length).toBe(3)
    })
  })

  it('should render the correct text content of thread, and all accordions except the last should be closed', async () => {
    await waitFor(() => {
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews[19].props.children).toEqual('mock sender 3')
      expect(textViews[20].props.children).toEqual('Invalid DateTime')
      expect(textViews[21].props.children).toEqual('Last accordion collapsible should be open, so the body text of this message should display')
      expect(textViews[22].props.children).toEqual('mock sender 2')
      expect(textViews[23].props.children).toEqual('Invalid DateTime')
      expect(textViews[24].props.children).toEqual('mock sender 1')
      expect(textViews[25].props.children).toEqual('Invalid DateTime')
    })
  })

  describe('when first message and last message is clicked', () => {
    it('should close first accordion and open last accordion', async () => {
      await waitFor(() => {
        testInstance.findAllByType(Pressable)[4].props.onPress()
      })
      await waitFor(() => {
        testInstance.findAllByType(Pressable)[6].props.onPress()
      })

      expect(testInstance.findAllByType(TextView)[21].props.children).toBe('mock sender 2')
      // Used to display last message's contents, but now there is no textview after the date
      expect(testInstance.findAllByType(TextView)[23].props.children).toBe('mock sender 1')
      expect(testInstance.findAllByType(TextView)[24].props.children).toBe('Invalid DateTime')
      expect(testInstance.findAllByType(TextView).length).toBe(26)
    })
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance({}, [], true)
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
