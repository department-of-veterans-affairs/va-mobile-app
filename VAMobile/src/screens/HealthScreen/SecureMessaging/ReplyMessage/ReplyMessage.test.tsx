import 'react-native'
import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'

import { context, mockNavProps, render } from 'testUtils'
import ReplyMessage from './ReplyMessage'
import { CategoryTypeFields, SecureMessagingMessageMap, SecureMessagingThreads } from 'store/api/types'
import { initialAuthState, initialErrorsState, initialSecureMessagingState, saveDraft } from 'store/slices'
import { isIOS } from '../../../../utils/platform'

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
    hasAttachments: false,
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
    hasAttachments: false,
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
    hasAttachments: false,
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
  let props: any
  let isIOSMock = isIOS as jest.Mock

  const initializeTestInstance = (
    mockMessagesById: SecureMessagingMessageMap,
    threadList: SecureMessagingThreads,
    loading: boolean = false,
    sendMessageFailed: boolean = false,
  ) => {

    isIOSMock.mockReturnValue(false)

    props = mockNavProps(
      undefined,
      {
        addListener: mockUseComposeCancelConfirmationSpy,
        goBack: jest.fn(),
        navigate: jest.fn(),
        setOptions: () => {},
      },
      { params: { messageID: 3, attachmentFileToAdd: {} } },
    )

    render(<ReplyMessage {...props} />, {
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

  }

  beforeEach(() => {
    initializeTestInstance(mockMessagesById, mockThreads)
  })

  describe('on click of the crisis line banner', () => {
    it('should call useRouteNavigation', async () => {
      fireEvent.press(screen.getByLabelText('talk-to-the-veterans-crisis-line-now'))
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('on click of the collapsible view', () => {
    it('should show the Reply Help panel', async () => {
      fireEvent.press(screen.getByLabelText('Only use messages for non-urgent needs'))
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  it('should add the text (*Required) for the message body text field', async () => {
    expect(screen.getByText('Message (Required)')).toBeTruthy()
  })

  describe('on click of save (draft)', () => {
    beforeEach(async () => {
      fireEvent.press(screen.getByText('Save'))
    })
    describe('when a required field is not filled', () => {
      it('should display a field error for that field and an AlertBox', async () => {
        expect(screen.getAllByText('Enter a message')).toBeTruthy()
        expect(screen.getAllByText('We need more information')).toBeTruthy()
        expect(screen.getAllByText('To save this message, provide this information:')).toBeTruthy()
      })
    })

    describe('when form fields are filled out correctly and saved', () => {
      it('should call saveDraft', async () => {
        fireEvent.changeText(screen.getByTestId('reply field'), 'Random String')
        fireEvent.press(screen.getByText('Save'))
        expect(saveDraft).toHaveBeenCalled()
      })
    })
  })

  describe('on click of send', () => {
    describe('when a required field is not filled', () => {
      beforeEach(async () => {
        fireEvent.press(screen.getByText('Send'))
      })

      it('should display a field error for that field and an AlertBox', async () => {
        expect(screen.getAllByText('Enter a message')).toBeTruthy()
        expect(screen.getAllByText('We need more information')).toBeTruthy()
        expect(screen.getAllByText('To send this message, provide this information:')).toBeTruthy()
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
      expect(screen.getByText("Loading your message...")).toBeTruthy()
    })
  })

  describe('on click of add files button', () => {
    it('should call useRouteNavigation', async () => {
      fireEvent.press(screen.getByLabelText('Add Files'))
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })
})
