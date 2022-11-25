import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, mockNavProps, render, RenderAPI, waitFor } from 'testUtils'
import { CategoryTypeFields, SecureMessagingMessageMap, SecureMessagingThreads } from 'store/api/types'
import { initialAuthState, initialErrorsState, initialSecureMessagingState } from 'store/slices'
import { AccordionCollapsible, AlertBox, LoadingComponent, TextView } from 'components'
import ViewMessageScreen from './ViewMessageScreen'
import Mock = jest.Mock
import { Pressable } from 'react-native'
import { getFormattedDateAndTimeZone } from 'utils/formattingUtils'
import IndividualMessageErrorComponent from './IndividualMessageErrorComponent'
import { StackNavigationOptions } from '@react-navigation/stack'
import { when } from 'jest-when'
import { DateTime, DiffOptions, Duration, DurationUnits } from 'luxon'
import { LocaleOptions } from 'luxon/src/datetime'

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

jest.mock('@react-navigation/native', () => {
  let actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    useNavigation: () => ({
      setOptions: jest.fn(),
      goBack: jest.fn(),
    }),
  }
})

// Contains message Ids grouped together by thread
const mockThreads: Array<Array<number>> = [[1, 2, 3], [45]]

// Create a date that's always more than 45 days from now
const nowInMill = 1643402338567
const mockDateISO = DateTime.fromMillis(nowInMill).toISO()
const fortySixDaysAgoISO = DateTime.fromMillis(nowInMill).minus({ days: 45 }).toISO()

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
    sentDate: mockDateISO,
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
    sentDate: fortySixDaysAgoISO, // message always older than 45 days
    senderId: 2,
    senderName: 'mock sender 45',
    recipientId: 3,
    recipientName: 'mock recipient name',
    readReceipt: 'mock read receipt',
  },
}

context('ViewMessageScreen', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance
  let onPressSpy: Mock
  let navHeaderSpy: any
  let navigateToSpy: jest.Mock
  onPressSpy = jest.fn(() => {})

  const initializeTestInstance = (
    mockMessagesById: SecureMessagingMessageMap,
    threadList: SecureMessagingThreads,
    loading: boolean = false,
    loadingFile: boolean = false,
    messageID: number = 3,
    messageIDsOfError?: Array<number>,
  ) => {
    /** messageID is 3 because inbox/folder previews the last message from a thread, aka the message we clicked on to access the rest of thread
     * While the renderMessages function can identify the correct thread array from any one of the messageIDs in that particular thread, it also
     * uses messageID to determine which AccordionCollapsible component should be expanded by default.
     * So it's important when testing to set this messageID to the last message in the thread to match design specs for ViewMessage.tsx
     * */
    props = mockNavProps(
      undefined,
      {
        navigate: jest.fn(),
        setOptions: (options: Partial<StackNavigationOptions>) => {
          navHeaderSpy = {
            back: options.headerLeft ? options.headerLeft({}) : undefined,
          }
        },
        goBack: jest.fn(),
      },
      { params: { messageID: messageID } },
    )

    const fromISOSpy = jest.spyOn(DateTime, 'fromISO')
    when(fromISOSpy)
      .calledWith(mockDateISO)
      .mockReturnValue({
        diffNow: (unit?: DurationUnits, opts?: DiffOptions) => {
          return {
            days: -14,
          } as Duration
        },
        toFormat: (fmt: string, opts?: LocaleOptions) => {
          return ''
        },
      } as DateTime)
      .calledWith(fortySixDaysAgoISO)
      .mockReturnValue({
        diffNow: (unit?: DurationUnits, opts?: DiffOptions) => {
          return {
            days: -46,
          } as Duration
        },
        toFormat: (fmt: string, opts?: LocaleOptions) => {
          return ''
        },
      } as DateTime)

    navigateToSpy = jest.fn()
    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('ComposeMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })
      .mockReturnValue(navigateToSpy)
    onPressSpy = jest.fn(() => {})

    component = render(<ViewMessageScreen {...props} />, {
      preloadedState: {
        auth: { ...initialAuthState },
        secureMessaging: {
          ...initialSecureMessagingState,
          loading: loading,
          messagesById: mockMessagesById,
          threads: threadList,
          messageIDsOfError: messageIDsOfError,
        },
        errors: initialErrorsState,
      },
    })

    testInstance = component.container
  }

  beforeEach(() => {
    initializeTestInstance(mockMessagesById, mockThreads)
  })

  it('initializes correctly', async () => {
    await waitFor(() => {
      expect(component).toBeTruthy()
    })
  })

  it('renders only messages in the same thread as the message associated with messageID', async () => {
    await waitFor(() => {
      expect(testInstance.findAllByType(AccordionCollapsible).length).toBe(3)
    })
  })

  it('should render the correct text content of thread, and all accordions except the last should be closed', async () => {
    await waitFor(() => {
      //button is now 0 so have to move everything down 1
      expect(testInstance.findAllByType(TextView)[2].props.children).toBe('mock sender 1')
      // Have to use Invalid DateTime values otherwise will fail git tests if in different time zone
      expect(testInstance.findAllByType(TextView)[3].props.children).toBe('Invalid DateTime')
      expect(testInstance.findAllByType(TextView)[4].props.children).toBe('mock sender 2')
      expect(testInstance.findAllByType(TextView)[5].props.children).toBe('Invalid DateTime')
      expect(testInstance.findAllByType(TextView)[6].props.children).toBe('mock sender 3')
      expect(testInstance.findAllByType(TextView)[7].props.children).toBe(getFormattedDateAndTimeZone(mockDateISO))
    })
  })

  it("should render last accordion's body text since it should be expanded", async () => {
    await waitFor(() => {
      //button is now 0 so have to move it down one
      expect(testInstance.findAllByType(TextView)[8].props.children).toBe('Last accordion collapsible should be open, so the body text of this message should display')
    })
  })

  describe('when first message and last message is clicked', () => {
    it('should expand first accordion and close last accordion', async () => {
      await waitFor(() => {
        testInstance.findAllByType(Pressable)[1].props.onPress()
        testInstance.findAllByType(Pressable)[3].props.onPress()
        expect(testInstance.findAllByType(TextView)[4].props.children).toBe('message 1 body text')
        // Used to display last message's contents, but now the textview after the date is the bottom Reply button's text
        expect(testInstance.findAllByType(TextView)[7].props.children).toBe('mock sender 3')
        expect(testInstance.findAllByType(TextView)[8].props.children).toBe(getFormattedDateAndTimeZone(mockDateISO))
        // Reply footer displays properly if latest message in thread is not over 45 days old
        expect(testInstance.findAllByType(TextView)[9].props.children).toBe('Reply')
      })
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

  describe('when loadingFile is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance({}, [], false, true)

      await waitFor(() => {
        expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
      })
    })
  })

  describe('when individual messages fail to load', () => {
    describe('when an individual message returns an error and that message is clicked', () => {
      it('should show AlertBox with "Message could not be found" title', async () => {
        initializeTestInstance(mockMessagesById, mockThreads, false, false, 3, [1])

        await waitFor(() => {
          testInstance.findAllByType(Pressable)[0].props.onPress()
          expect(testInstance.findByType(IndividualMessageErrorComponent)).toBeTruthy()
          expect(testInstance.findByProps({ title: 'Message could not be found' })).toBeTruthy()
        })
      })
    })
    describe('when multiple messages are expanded and fail to load', () => {
      it('should show multiple error components', async () => {
        initializeTestInstance(mockMessagesById, mockThreads, false, false, 3, [1, 3])

        await waitFor(() => {
          testInstance.findAllByType(Pressable)[1].props.onPress()
          testInstance.findAllByType(Pressable)[3].props.onPress()
          expect(testInstance.findAllByType(IndividualMessageErrorComponent)).toBeTruthy()
          expect(testInstance.findAllByProps({ title: 'Message could not be found' })).toBeTruthy()
        })
      })
    })
  })

  describe('when message is older than 45 days', () => {
    // changing to a different message thread by changing to different messageID
    beforeEach(() => {
      initializeTestInstance(mockMessagesById, mockThreads, false, false, 45)
    })

    it('should show AlertBox with Compose button', async () => {
      await waitFor(() => {
        expect(testInstance.findByType(AlertBox)).toBeTruthy()
        expect(testInstance.findByProps({ label: 'Compose a new message' })).toBeTruthy()
      })
    })

    it('should use route navigation when Compose button is clicked', async () => {
      await waitFor(() => {
        testInstance.findByProps({ label: 'Compose a new message' }).props.onPress()
        expect(navigateToSpy).toHaveBeenCalled()
      })
    })
  })
})
