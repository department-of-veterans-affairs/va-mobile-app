import 'react-native'
import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { context, mockNavProps, render } from 'testUtils'
import EditDraft from './EditDraft'
import { initializeErrorsByScreenID, InitialState, updateSecureMessagingTab } from 'store/slices'
import { CategoryTypeFields, ScreenIDTypesConstants, SecureMessagingMessageMap } from 'store/api/types'
import { CommonErrorTypesConstants } from 'constants/errors'

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
    getMessage: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
    getMessageRecipients: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
    getThread: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

let mockUseComposeCancelConfirmationSpy = jest.fn()
let mockUseGoToDraftSpy = jest.fn()
jest.mock('../CancelConfirmations/ComposeCancelConfirmation', () => {
  let original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useComposeCancelConfirmation: () => [false, mockUseComposeCancelConfirmationSpy],
    useGoToDrafts: () => mockUseGoToDraftSpy,
  }
})

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native')
  RN.InteractionManager.runAfterInteractions = (callback: () => void) => {
    callback()
  }

  return RN
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
    hasAttachments: false,
    attachment: false,
    sentDate: '1',
    senderId: 3,
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
    senderId: 4,
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
    senderId: 5,
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

context('EditDraft', () => {
  let props: any
  let goBack: jest.Mock
  let navigateSpy: jest.Mock

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
    navigateSpy = jest.fn()
    const errorsByScreenID = initializeErrorsByScreenID()
    errorsByScreenID[screenID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

    props = mockNavProps(
      undefined,
      {
        addListener: mockUseComposeCancelConfirmationSpy,
        navigate: navigateSpy,
        goBack,
        setOptions: jest.fn(),
      },
      { params: { attachmentFileToAdd: {}, messageID } },
    )

    render(<EditDraft {...props} />, {
      preloadedState: {
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
                    preferredTeam: true,
                  },
                },
                {
                  id: 'id2',
                  type: 'type',
                  attributes: {
                    triageTeamId: 1,
                    name: 'Doctor 2',
                    relationType: 'PATIENT',
                    preferredTeam: true,
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
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance({})
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
      expect(screen.getByText("We can't match you with a provider")).toBeTruthy()
    })

    describe('on click of the go to inbox button', () => {
      it('should call useRouteNavigation and updateSecureMessagingTab', async () => {
        fireEvent.press(screen.getByText('Go to inbox'))
        expect(navigateSpy).toHaveBeenCalled()
        expect(updateSecureMessagingTab).toHaveBeenCalled()
      })
    })
  })

  describe('when hasLoadedRecipients is false', () => {
    it('should display the LoadingComponent', async () => {
      initializeTestInstance({ loading: true })
      expect(screen.getByText("Loading your draft...")).toBeTruthy()
    })
  })

  describe('when there is an error', () => {
    it('should display the ErrorComponent', async () => {
      initializeTestInstance({ screenID: ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID })
      expect(screen.getByText("The app can't be loaded.")).toBeTruthy()
    })
  })

  describe('on click of the collapsible view', () => {
    it('should show the Reply Help panel', async () => {
      fireEvent.press(screen.getByLabelText('Only use messages for non-urgent needs'))
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('when pressing the back button', () => {
    it('should ask for confirmation if any field filled in', async () => {
      fireEvent.changeText(screen.getByTestId('messageText'), 'Random String')
      fireEvent.press(screen.getByText('Cancel'))
      expect(goBack).not.toHaveBeenCalled()
      expect(mockUseComposeCancelConfirmationSpy).toHaveBeenCalled()
    })
  })

  describe('on click of add files button', () => {
    it('should call useRouteNavigation', async () => {
      fireEvent.press(screen.getByLabelText('Add Files'))
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })
})
