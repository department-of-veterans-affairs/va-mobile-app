import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'
import { StackNavigationOptions } from '@react-navigation/stack/lib/typescript/src/types'
import { fireEvent, screen } from '@testing-library/react-native'
import { context, findByTypeWithText, mockNavProps, render, RenderAPI, waitFor } from 'testUtils'
import EditDraft from './EditDraft'
import { Pressable, TouchableWithoutFeedback } from 'react-native'
import { AlertBox, ErrorComponent, LoadingComponent, TextView, VATextInput } from 'components'
import { initializeErrorsByScreenID, InitialState, updateSecureMessagingTab } from 'store/slices'
import { CategoryTypeFields, ScreenIDTypesConstants, SecureMessagingMessageMap } from 'store/api/types'
import { CommonErrorTypesConstants } from 'constants/errors'
import { when } from 'jest-when'

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
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any
  let goBack: jest.Mock
  let navHeaderSpy: any
  let navigateSpy: jest.Mock
  let navigateToVeteransCrisisLineSpy: jest.Mock
  let navigateToAddToFilesSpy: jest.Mock
  let navigateToAttachAFileSpy: jest.Mock

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
    navigateToVeteransCrisisLineSpy = jest.fn()
    navigateToAddToFilesSpy = jest.fn()
    navigateToAttachAFileSpy = jest.fn()
    const errorsByScreenID = initializeErrorsByScreenID()
    errorsByScreenID[screenID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('VeteransCrisisLine')
      .mockReturnValue(navigateToVeteransCrisisLineSpy)
      .calledWith('Attachments', { origin: 'Draft', attachmentsList: [], messageID: 2 })
      .mockReturnValue(navigateToAddToFilesSpy)
      .calledWith('AttachmentsFAQ', { originHeader: 'Edit Draft' })
      .mockReturnValue(navigateToAttachAFileSpy)

    props = mockNavProps(
      undefined,
      {
        navigate: navigateSpy,
        goBack,
        setOptions: (options: Partial<StackNavigationOptions>) => {
          navHeaderSpy = {
            back: options.headerLeft ? options.headerLeft({}) : undefined,
          }
        },
      },
      { params: { attachmentFileToAdd: {}, messageID } },
    )

    component = render(<EditDraft {...props} />, {
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

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance({})
  })

  it('initializes correctly', async () => {
    await waitFor(() => {
      expect(component).toBeTruthy()
    })
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
      await waitFor(() => {
        expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      })
    })

    describe('on click of the go to inbox button', () => {
      it('should call useRouteNavigation and updateSecureMessagingTab', async () => {
        await waitFor(() => {
          fireEvent.press(screen.getByText('Go to inbox'))
          expect(navigateSpy).toHaveBeenCalled()
          expect(updateSecureMessagingTab).toHaveBeenCalled()
        })
      })
    })
  })

  describe('when hasLoadedRecipients is false', () => {
    it('should display the LoadingComponent', async () => {
      await waitFor(() => {
        initializeTestInstance({ loading: true })
        expect(testInstance.findAllByType(LoadingComponent).length).toEqual(1)
      })
    })
  })

  describe('when there is an error', () => {
    it('should display the ErrorComponent', async () => {
      await waitFor(() => {
        initializeTestInstance({ screenID: ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID })
        expect(testInstance.findAllByType(ErrorComponent).length).toEqual(1)
      })
    })
  })

  describe('on click of the crisis line banner', () => {
    it('should call useRouteNavigation', async () => {
      await waitFor(() => {
        fireEvent.press(screen.getByText('Veterans Crisis Line'))
        testInstance.findAllByType(TouchableWithoutFeedback)[1].props.onPress()
        expect(navigateToVeteransCrisisLineSpy).toHaveBeenCalled()
      })
    })
  })

  describe('on click of the collapsible view', () => {
    it('should display the when will i get a reply children text', async () => {
      await waitFor(
        () => {
          fireEvent.press(screen.getByText('When will I get a reply?'))
        },
        { timeout: 2000 },
      )

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
      await waitFor(() => {
        testInstance.findAllByType(VATextInput)[0].props.onChange('Random string')
        navHeaderSpy.back.props.onPress()
        expect(goBack).not.toHaveBeenCalled()
        expect(mockUseComposeCancelConfirmationSpy).toHaveBeenCalled()
      })
    })
  })

  describe('on click of add files button', () => {
    it('should call useRouteNavigation', async () => {
      await waitFor(() => {
        fireEvent.press(screen.getByText('Add Files'))
        expect(navigateToAddToFilesSpy).toHaveBeenCalled()
      })
    })
  })
})
