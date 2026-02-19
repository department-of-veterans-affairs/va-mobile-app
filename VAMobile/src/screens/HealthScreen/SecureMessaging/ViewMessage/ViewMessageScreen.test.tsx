import React from 'react'

import { screen } from '@testing-library/react-native'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import {
  CategoryTypeFields,
  SecureMessagingFolderMessagesGetData,
  SecureMessagingFoldersGetData,
  SecureMessagingMessageGetData,
  SecureMessagingSystemFolderIdConstants,
  SecureMessagingThreadGetData,
} from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import ViewMessageScreen from 'screens/HealthScreen/SecureMessaging/ViewMessage/ViewMessageScreen'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'

jest.mock('api/authorizedServices/getAuthorizedServices')

context('ViewMessageScreen', () => {
  const thread: SecureMessagingThreadGetData = {
    data: [
      {
        id: 1,
        type: '1',
        attributes: {
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
          isOhMessage: false,
        },
      },
      {
        id: 2,
        type: '1',
        attributes: {
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
          isOhMessage: false,
        },
      },
      {
        id: 3,
        type: '3',
        attributes: {
          messageId: 3,
          category: CategoryTypeFields.other,
          subject: '',
          body: 'Last accordion collapsible should be open, so the body text of this message should display 1-800-698-2411.Thank',
          hasAttachments: false,
          attachment: false,
          sentDate: '3',
          senderId: 2,
          senderName: 'mock sender 3',
          recipientId: 3,
          recipientName: 'mock recipient name 3',
          readReceipt: 'mock read receipt',
          isOhMessage: false,
        },
      },
    ],
  }
  const oldThread: SecureMessagingThreadGetData = {
    data: [],
  }
  const oldMessage: SecureMessagingMessageGetData = {
    data: {
      id: 45,
      type: '3',
      attributes: {
        messageId: 45,
        category: CategoryTypeFields.other,
        subject: 'This message should not display because it has different thread ID',
        body: 'test',
        hasAttachments: false,
        attachment: false,
        sentDate: '2013-06-06T04:00:00.000+00:00',
        senderId: 2,
        senderName: 'mock sender 45',
        recipientId: 3,
        recipientName: 'mock recipient name',
        readReceipt: 'mock read receipt',
        isOhMessage: false,
      },
    },
    included: [],
    meta: {
      userInTriageTeam: true,
    },
  }

  const message: SecureMessagingMessageGetData = {
    data: {
      id: 3,
      type: '3',
      attributes: {
        messageId: 3,
        category: CategoryTypeFields.other,
        subject: '',
        body: 'Last accordion collapsible should be open, so the body text of this message should display 1-800-698-2411.Thank',
        hasAttachments: false,
        attachment: false,
        sentDate: '3',
        senderId: 2,
        senderName: 'mock sender 3',
        recipientId: 3,
        recipientName: 'mock recipient name 3',
        readReceipt: 'mock read receipt',
        isOhMessage: false,
      },
    },
    included: [],
    meta: {
      userInTriageTeam: true,
    },
  }

  const listOfFolders: SecureMessagingFoldersGetData = {
    data: [
      {
        type: 'folders',
        id: '-2',
        attributes: {
          folderId: -2,
          name: 'Drafts',
          count: 2,
          unreadCount: 2,
          systemFolder: true,
        },
      },
      {
        type: 'folders',
        id: '-1',
        attributes: {
          folderId: -1,
          name: 'Sent',
          count: 32,
          unreadCount: 0,
          systemFolder: true,
        },
      },
      {
        type: 'folders',
        id: '-3',
        attributes: {
          folderId: -3,
          name: 'Deleted',
          count: 24,
          unreadCount: 0,
          systemFolder: true,
        },
      },
      {
        type: 'folders',
        id: '100',
        attributes: {
          folderId: 100,
          name: 'test 1',
          count: 3,
          unreadCount: 0,
          systemFolder: true,
        },
      },
      {
        type: 'folders',
        id: '101',
        attributes: {
          folderId: 101,
          name: 'test 2',
          count: 12,
          unreadCount: 0,
          systemFolder: true,
        },
      },
    ],
    links: {
      self: '',
      first: '',
      prev: '',
      next: '',
      last: '',
    },
    meta: {
      pagination: {
        currentPage: 1,
        perPage: 10,
        totalPages: 1,
        totalEntries: 5,
      },
    },
    inboxUnreadCount: 0,
  }

  const messages: SecureMessagingFolderMessagesGetData = {
    data: [
      {
        type: 'test',
        id: 1,
        attributes: {
          messageId: 1,
          category: CategoryTypeFields.other,
          subject: 'test',
          body: 'test',
          hasAttachments: false,
          attachment: false,
          sentDate: '1-1-21',
          senderId: 2,
          senderName: 'mock sender',
          recipientId: 3,
          recipientName: 'mock recipient name',
          readReceipt: 'mock read receipt',
          isOhMessage: false,
        },
      },
    ],
    links: {
      self: '',
      first: '',
      prev: '',
      next: '',
      last: '',
    },
    meta: {
      sort: {
        sentDate: 'DESC',
      },
      pagination: {
        currentPage: 1,
        perPage: 1,
        totalPages: 3,
        totalEntries: 5,
      },
    },
  }

  beforeEach(() => {
    ;(useAuthorizedServices as jest.Mock).mockReturnValue({
      data: {
        migratingFacilitiesList: [],
      },
    })
  })

  const initializeTestInstance = (messageID: number = 3) => {
    render(
      <ViewMessageScreen
        {...mockNavProps(
          undefined,
          {
            navigate: jest.fn(),
            setOptions: jest.fn(),
            goBack: jest.fn(),
          },
          { params: { messageID: messageID } },
        )}
      />,
    )
  }

  describe('when latest message is older than 45 days', () => {
    it('should have the Start new message button', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v1/messaging/health/messages/${45}/thread?excludeProvidedMessage=${true}`, {
          useCache: 'false',
        })
        .mockResolvedValue(oldThread)
        .calledWith(`/v0/messaging/health/messages/${45}`)
        .mockResolvedValue(oldMessage)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(listOfFolders)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        } as api.Params)
        .mockResolvedValue(messages)
      initializeTestInstance(45)
      await waitFor(() => expect(screen.getByText('mock sender 45')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Start new message')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('This conversation is too old for new replies')).toBeTruthy())
    })
  })

  describe('Should load the screen correctly', () => {
    it('renders correct amount of CollapsibleMessages', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v1/messaging/health/messages/${3}/thread?excludeProvidedMessage=${true}`, {
          useCache: 'false',
        })
        .mockResolvedValue(thread)
        .calledWith(`/v0/messaging/health/messages/${3}`)
        .mockResolvedValue(message)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(listOfFolders)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        } as api.Params)
        .mockResolvedValue(messages)
      initializeTestInstance()
      expect(screen.getByText('Loading your message...')).toBeTruthy()
      await waitFor(() => expect(screen.queryByRole('link', { name: '1-800-698-2411.Thank' })).toBeFalsy())
      await waitFor(() => expect(screen.getAllByRole('tab').length).toBe(2))
      await waitFor(() => expect(screen.getByText('mock sender 1')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('mock sender 2')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('mock sender 3')).toBeTruthy())
      await waitFor(() => expect(screen.queryByText('mock sender 45')).toBeFalsy())
      await waitFor(() => expect(screen.getByText('Reply')).toBeTruthy())
    })
  })

  describe('when user is in triage team', () => {
    it('should show "too old for replies" alert when message is older than 45 days', async () => {
      const messageWithTriageTeam: SecureMessagingMessageGetData = {
        data: {
          id: 45,
          type: '3',
          attributes: {
            messageId: 45,
            category: CategoryTypeFields.other,
            subject: 'Old message subject',
            body: 'test',
            hasAttachments: false,
            attachment: false,
            sentDate: '2013-06-06T04:00:00.000+00:00',
            senderId: 2,
            senderName: 'mock sender 45',
            recipientId: 3,
            recipientName: 'mock recipient name',
            readReceipt: 'mock read receipt',
            isOhMessage: false,
          },
        },
        included: [],
        meta: {
          userInTriageTeam: true,
        },
      }

      when(api.get as jest.Mock)
        .calledWith(`/v1/messaging/health/messages/${45}/thread?excludeProvidedMessage=${true}`, {
          useCache: 'false',
        })
        .mockResolvedValue(oldThread)
        .calledWith(`/v0/messaging/health/messages/${45}`)
        .mockResolvedValue(messageWithTriageTeam)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(listOfFolders)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        } as api.Params)
        .mockResolvedValue(messages)

      initializeTestInstance(45)
      await waitFor(() => expect(screen.getByText('mock sender 45')).toBeTruthy())
      await waitFor(() => expect(screen.getByTestId('secureMessagingOlderThan45DaysAlertID')).toBeTruthy())
      await waitFor(() => expect(screen.queryByTestId('secureMessagingYouCanNoLongerAlertID')).toBeFalsy())
    })

    it('should not show any alert when message is not expired', async () => {
      const recentMessageWithTriageTeam: SecureMessagingMessageGetData = {
        ...message,
        meta: {
          userInTriageTeam: true,
        },
      }

      when(api.get as jest.Mock)
        .calledWith(`/v1/messaging/health/messages/${3}/thread?excludeProvidedMessage=${true}`, {
          useCache: 'false',
        })
        .mockResolvedValue(thread)
        .calledWith(`/v0/messaging/health/messages/${3}`)
        .mockResolvedValue(recentMessageWithTriageTeam)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(listOfFolders)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        } as api.Params)
        .mockResolvedValue(messages)

      initializeTestInstance()
      await waitFor(() => expect(screen.getByText('mock sender 3')).toBeTruthy())
      await waitFor(() => expect(screen.queryByTestId('secureMessagingOlderThan45DaysAlertID')).toBeFalsy())
      await waitFor(() => expect(screen.queryByTestId('secureMessagingYouCanNoLongerAlertID')).toBeFalsy())
    })
  })

  describe('when user is not in triage team', () => {
    it('should show "you can no longer" alert with facility link', async () => {
      const messageWithoutTriageTeam: SecureMessagingMessageGetData = {
        ...message,
        meta: {
          userInTriageTeam: false,
        },
      }

      when(api.get as jest.Mock)
        .calledWith(`/v1/messaging/health/messages/${3}/thread?excludeProvidedMessage=${true}`, {
          useCache: 'false',
        })
        .mockResolvedValue(thread)
        .calledWith(`/v0/messaging/health/messages/${3}`)
        .mockResolvedValue(messageWithoutTriageTeam)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(listOfFolders)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        } as api.Params)
        .mockResolvedValue(messages)

      initializeTestInstance()
      await waitFor(() => expect(screen.getByText('mock sender 3')).toBeTruthy())
      await waitFor(() => expect(screen.getByTestId('secureMessagingYouCanNoLongerAlertID')).toBeTruthy())
      await waitFor(() => expect(screen.queryByTestId('secureMessagingOlderThan45DaysAlertID')).toBeFalsy())
      await waitFor(() => expect(screen.getByText('Find your VA facility')).toBeTruthy())
    })

    it('should show "you can no longer" alert even when message is expired (takes precedence over expired alert)', async () => {
      const oldMessageWithoutTriageTeam: SecureMessagingMessageGetData = {
        data: {
          id: 45,
          type: '3',
          attributes: {
            messageId: 45,
            category: CategoryTypeFields.other,
            subject: 'Old message subject',
            body: 'test',
            hasAttachments: false,
            attachment: false,
            sentDate: '2013-06-06T04:00:00.000+00:00',
            senderId: 2,
            senderName: 'mock sender 45',
            recipientId: 3,
            recipientName: 'mock recipient name',
            readReceipt: 'mock read receipt',
            isOhMessage: false,
          },
        },
        included: [],
        meta: {
          userInTriageTeam: false,
        },
      }

      when(api.get as jest.Mock)
        .calledWith(`/v1/messaging/health/messages/${45}/thread?excludeProvidedMessage=${true}`, {
          useCache: 'false',
        })
        .mockResolvedValue(oldThread)
        .calledWith(`/v0/messaging/health/messages/${45}`)
        .mockResolvedValue(oldMessageWithoutTriageTeam)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(listOfFolders)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        } as api.Params)
        .mockResolvedValue(messages)

      initializeTestInstance(45)
      await waitFor(() => expect(screen.getByText('mock sender 45')).toBeTruthy())
      await waitFor(() => expect(screen.getByTestId('secureMessagingYouCanNoLongerAlertID')).toBeTruthy())
      await waitFor(() => expect(screen.queryByTestId('secureMessagingOlderThan45DaysAlertID')).toBeFalsy())
      await waitFor(() => expect(screen.getByText('Find your VA facility')).toBeTruthy())
    })
  })

  describe('when message has OH migration phase blocking replies', () => {
    const mockMigrationPhases = {
      current: 'p3',
      p0: 'March 1, 2026',
      p1: 'March 15, 2026',
      p2: 'April 1, 2026',
      p3: 'April 24, 2026',
      p4: 'April 27, 2026',
      p5: 'May 1, 2026',
      p6: 'May 3, 2026',
      p7: 'May 8, 2026',
    }

    const mockMigrationFacilities = [
      { facilityId: 528, facilityName: 'Test VA Medical Center' },
      { facilityId: 123, facilityName: 'Different VA Medical Center' },
    ]

    const migrationMessage: SecureMessagingMessageGetData = {
      data: {
        id: 3,
        type: '3',
        attributes: {
          messageId: 3,
          category: CategoryTypeFields.other,
          subject: 'Migration test',
          body: 'test body',
          hasAttachments: false,
          attachment: false,
          sentDate: '3',
          senderId: 2,
          senderName: 'mock sender 3',
          recipientId: 3,
          recipientName: 'mock recipient name 3',
          readReceipt: 'mock read receipt',
          isOhMessage: false,
          ohMigrationPhase: 'p3',
        },
      },
      included: [],
      meta: {
        userInTriageTeam: true,
      },
    }

    const setupMigrationMock = (currentPhase: string, facilities = [mockMigrationFacilities[0]]) => {
      ;(useAuthorizedServices as jest.Mock).mockReturnValue({
        data: {
          migratingFacilitiesList: [
            {
              migrationDate: '2026-05-01',
              facilities,
              phases: { ...mockMigrationPhases, current: currentPhase },
            },
          ],
        },
      })
    }

    const setupApiCalls = (messageID: number, messageData: SecureMessagingMessageGetData, threadData = thread) => {
      when(api.get as jest.Mock)
        .calledWith(`/v1/messaging/health/messages/${messageID}/thread?excludeProvidedMessage=${true}`, {
          useCache: 'false',
        })
        .mockResolvedValue(threadData)
        .calledWith(`/v0/messaging/health/messages/${messageID}`)
        .mockResolvedValue(messageData)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(listOfFolders)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        } as api.Params)
        .mockResolvedValue(messages)
    }

    it('should hide Reply and Start new message buttons when migration blocks replies', async () => {
      setupMigrationMock('p3')
      setupApiCalls(3, migrationMessage)
      initializeTestInstance()
      await waitFor(() => expect(screen.getByText('mock sender 3')).toBeTruthy())
      await waitFor(() => expect(screen.queryByText('Start new message')).toBeFalsy())
      await waitFor(() => expect(screen.queryByText('Reply')).toBeFalsy())
    })

    describe('renderAlerts', () => {
      it('should show migration error alert with correct header when migration blocks replies', async () => {
        setupMigrationMock('p3')
        setupApiCalls(3, migrationMessage)
        initializeTestInstance()
        await waitFor(() =>
          expect(screen.getByText("You can't reply to conversations at some facilities")).toBeTruthy(),
        )
      })

      it('should show migration error alert body text', async () => {
        setupMigrationMock('p3')
        setupApiCalls(3, migrationMessage)
        initializeTestInstance()
        await waitFor(() =>
          expect(
            screen.getByText("You can't reply to conversations with care teams at these facilities:"),
          ).toBeTruthy(),
        )
      })

      it('should display facility names in the migration error alert', async () => {
        setupMigrationMock('p3', mockMigrationFacilities)
        setupApiCalls(3, migrationMessage)
        initializeTestInstance()
        await waitFor(() => expect(screen.getByText('Test VA Medical Center')).toBeTruthy())
        await waitFor(() => expect(screen.getByText('Different VA Medical Center')).toBeTruthy())
      })

      it('should show the note about calling the facility directly', async () => {
        setupMigrationMock('p3')
        setupApiCalls(3, migrationMessage)
        initializeTestInstance()
        await waitFor(() =>
          expect(
            screen.getByText('If you need to contact your care team now, call the facility directly.'),
          ).toBeTruthy(),
        )
      })

      it('should show the facility locator link in migration error alert', async () => {
        setupMigrationMock('p3')
        setupApiCalls(3, migrationMessage)
        initializeTestInstance()
        await waitFor(() => expect(screen.getByTestId('goToFindLocationInfoTestID')).toBeTruthy())
      })

      it('should show migration error alert for p4 phase', async () => {
        setupMigrationMock('p4')
        const p4Message = {
          ...migrationMessage,
          data: {
            ...migrationMessage.data,
            attributes: { ...migrationMessage.data.attributes, ohMigrationPhase: 'p4' },
          },
        }
        setupApiCalls(3, p4Message)
        initializeTestInstance()
        await waitFor(() =>
          expect(screen.getByText("You can't reply to conversations at some facilities")).toBeTruthy(),
        )
      })

      it('should show migration error alert for p5 phase', async () => {
        setupMigrationMock('p5')
        const p5Message = {
          ...migrationMessage,
          data: {
            ...migrationMessage.data,
            attributes: { ...migrationMessage.data.attributes, ohMigrationPhase: 'p5' },
          },
        }
        setupApiCalls(3, p5Message)
        initializeTestInstance()
        await waitFor(() =>
          expect(screen.getByText("You can't reply to conversations at some facilities")).toBeTruthy(),
        )
      })

      it('should take precedence over "too old for replies" alert when migration blocks replies', async () => {
        setupMigrationMock('p4')
        const migrationOldMessage: SecureMessagingMessageGetData = {
          data: {
            id: 45,
            type: '3',
            attributes: {
              messageId: 45,
              category: CategoryTypeFields.other,
              subject: 'Old migration message',
              body: 'test',
              hasAttachments: false,
              attachment: false,
              sentDate: '2013-06-06T04:00:00.000+00:00',
              senderId: 2,
              senderName: 'mock sender 45',
              recipientId: 3,
              recipientName: 'mock recipient name',
              readReceipt: 'mock read receipt',
              isOhMessage: false,
              ohMigrationPhase: 'p4',
            },
          },
          included: [],
          meta: {
            userInTriageTeam: true,
          },
        }
        setupApiCalls(45, migrationOldMessage, oldThread)
        initializeTestInstance(45)
        await waitFor(() => expect(screen.getByText('mock sender 45')).toBeTruthy())
        await waitFor(() =>
          expect(screen.getByText("You can't reply to conversations at some facilities")).toBeTruthy(),
        )
        await waitFor(() => expect(screen.queryByTestId('secureMessagingOlderThan45DaysAlertID')).toBeFalsy())
      })

      it('should take precedence over "you can no longer" alert when migration blocks replies', async () => {
        setupMigrationMock('p3')
        const migrationNoTriageMessage: SecureMessagingMessageGetData = {
          ...migrationMessage,
          meta: {
            userInTriageTeam: false,
          },
        }
        setupApiCalls(3, migrationNoTriageMessage)
        initializeTestInstance()
        await waitFor(() => expect(screen.getByText('mock sender 3')).toBeTruthy())
        await waitFor(() =>
          expect(screen.getByText("You can't reply to conversations at some facilities")).toBeTruthy(),
        )
        await waitFor(() => expect(screen.queryByTestId('secureMessagingYouCanNoLongerAlertID')).toBeFalsy())
      })

      it('should not show migration error alert when migration phase does not block replies', async () => {
        const nonBlockingMigrationMessage: SecureMessagingMessageGetData = {
          data: {
            id: 3,
            type: '3',
            attributes: {
              messageId: 3,
              category: CategoryTypeFields.other,
              subject: 'Non-blocking migration',
              body: 'test body',
              hasAttachments: false,
              attachment: false,
              sentDate: '3',
              senderId: 2,
              senderName: 'mock sender 3',
              recipientId: 3,
              recipientName: 'mock recipient name 3',
              readReceipt: 'mock read receipt',
              isOhMessage: false,
              ohMigrationPhase: 'p1',
            },
          },
          included: [],
          meta: {
            userInTriageTeam: true,
          },
        }

        setupApiCalls(3, nonBlockingMigrationMessage)
        initializeTestInstance()
        await waitFor(() => expect(screen.getByText('mock sender 3')).toBeTruthy())
        await waitFor(() => expect(screen.getByText('Reply')).toBeTruthy())
        await waitFor(() =>
          expect(screen.queryByText("You can't reply to conversations at some facilities")).toBeFalsy(),
        )
      })

      it('should show "you can no longer" alert when not in triage team and no migration blocking', async () => {
        const messageNotInTriageTeam: SecureMessagingMessageGetData = {
          ...message,
          meta: {
            userInTriageTeam: false,
          },
        }
        setupApiCalls(3, messageNotInTriageTeam)
        initializeTestInstance()
        await waitFor(() => expect(screen.getByText('mock sender 3')).toBeTruthy())
        await waitFor(() => expect(screen.getByTestId('secureMessagingYouCanNoLongerAlertID')).toBeTruthy())
        await waitFor(() =>
          expect(screen.queryByText("You can't reply to conversations at some facilities")).toBeFalsy(),
        )
      })

      it('should show "too old for replies" alert when reply is expired and no migration blocking', async () => {
        setupApiCalls(45, oldMessage, oldThread)
        initializeTestInstance(45)
        await waitFor(() => expect(screen.getByText('mock sender 45')).toBeTruthy())
        await waitFor(() => expect(screen.getByTestId('secureMessagingOlderThan45DaysAlertID')).toBeTruthy())
        await waitFor(() =>
          expect(screen.queryByText("You can't reply to conversations at some facilities")).toBeFalsy(),
        )
      })

      it('should show no alerts when in triage team, not expired, and no migration blocking', async () => {
        setupApiCalls(3, message)
        initializeTestInstance()
        await waitFor(() => expect(screen.getByText('mock sender 3')).toBeTruthy())
        await waitFor(() => expect(screen.queryByTestId('secureMessagingOlderThan45DaysAlertID')).toBeFalsy())
        await waitFor(() => expect(screen.queryByTestId('secureMessagingYouCanNoLongerAlertID')).toBeFalsy())
        await waitFor(() =>
          expect(screen.queryByText("You can't reply to conversations at some facilities")).toBeFalsy(),
        )
      })
    })
  })
})
