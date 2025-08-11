import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import {
  CategoryTypeFields,
  FacilitiesPayload,
  SecureMessagingFolderMessagesGetData,
  SecureMessagingRecipients,
  SecureMessagingSignatureData,
  SecureMessagingSystemFolderIdConstants,
} from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import StartNewMessage from 'screens/HealthScreen/SecureMessaging/StartNewMessage/StartNewMessage'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'

const mockNavigationSpy = jest.fn()
jest.mock('../../../../utils/hooks', () => {
  const original = jest.requireActual('../../../../utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

const mockUseComposeCancelConfirmationSpy = jest.fn()
jest.mock('../CancelConfirmations/ComposeCancelConfirmation', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useComposeCancelConfirmation: () => [false, mockUseComposeCancelConfirmationSpy],
  }
})

context('StartNewMessage', () => {
  let goBack: jest.Mock

  const signature: SecureMessagingSignatureData = {
    data: {
      id: '1',
      type: 'hah',
      attributes: {
        signatureName: 'signatureName',
        includeSignature: false,
        signatureTitle: 'Title',
      },
    },
  }
  const facilities: FacilitiesPayload = {
    data: {
      attributes: {
        facilities: [
          {
            id: '357',
            name: 'Cary VA Medical Center',
            city: 'Cary',
            state: 'WY',
            cerner: false,
            miles: '3.63',
          },
          {
            id: '358',
            name: 'Cheyenne VA Medical Center',
            city: 'Cheyenne',
            state: 'WY',
            cerner: false,
            miles: '3.17',
          },
        ],
      },
    },
  }
  const singleFacility: FacilitiesPayload = {
    data: {
      attributes: {
        facilities: [
          {
            id: '357',
            name: 'Cary VA Medical Center',
            city: 'Cary',
            state: 'WY',
            cerner: false,
            miles: '3.63',
          },
        ],
      },
    },
  }
  const folderMessages: SecureMessagingFolderMessagesGetData = {
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
  const recipients: SecureMessagingRecipients = {
    data: [
      {
        id: 'id',
        type: 'type',
        attributes: {
          triageTeamId: 0,
          name: 'Doctor 1',
          relationType: 'PATIENT',
          preferredTeam: true,
          stationNumber: '357',
          locationName: 'test_location',
          suggestedNameDisplay: 'test_suggested_name',
          healthCareSystemName: 'test_healthcare_system_name',
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
          stationNumber: '357',
          locationName: 'test_location',
          suggestedNameDisplay: 'test_suggested_name',
          healthCareSystemName: 'test_healthcare_system_name',
        },
      },
    ],
    meta: {
      sort: {
        name: 'ASC',
      },
    },
  }
  const initializeTestInstance = (params: object = { attachmentFileToAdd: {} }) => {
    goBack = jest.fn()

    const props = mockNavProps(
      undefined,
      {
        addListener: mockUseComposeCancelConfirmationSpy,
        navigate: mockNavigationSpy,
        goBack,
        setOptions: jest.fn(),
      },
      { params: params },
    )

    render(<StartNewMessage {...props} />, {})
  }

  const initializeApiCalls = (facilityMock: FacilitiesPayload) => {
    when(api.get as jest.Mock)
      .calledWith('/v0/messaging/health/allrecipients')
      .mockResolvedValue(recipients)
      .calledWith('/v0/messaging/health/messages/signature')
      .mockResolvedValue(signature)
      .calledWith('/v0/facilities-info')
      .mockResolvedValue(facilityMock)
      .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.SENT}/messages`, {
        page: '1',
        per_page: LARGE_PAGE_SIZE.toString(),
        useCache: 'false',
      } as api.Params)
      .mockResolvedValue(folderMessages)
  }

  describe('when no recipients are returned', () => {
    it('should display an AlertBox', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/messaging/health/allrecipients')
        .mockResolvedValue({
          data: [],
          meta: {
            sort: {
              name: 'ASC',
            },
          },
        })
        .calledWith('/v0/messaging/health/messages/signature')
        .mockResolvedValue(signature)
        .calledWith('/v0/facilities-info')
        .mockResolvedValue(facilities)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.SENT}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        } as api.Params)
        .mockResolvedValue(folderMessages)
      initializeTestInstance()
      expect(screen.getByText(t('secureMessaging.formMessage.startNewMessage.loading'))).toBeTruthy()
      await waitFor(() =>
        expect(screen.getByText(t('secureMessaging.startNewMessage.noMatchWithProvider'))).toBeTruthy(),
      )
      expect(screen.getByText(t('secureMessaging.startNewMessage.bothYouAndProviderMustBeEnrolled'))).toBeTruthy()
      fireEvent.press(screen.getByRole('link', { name: t('secureMessaging.goToInbox') }))
      await waitFor(() => expect(mockNavigationSpy).toHaveBeenCalledWith('SecureMessaging', { activeTab: 0 }))
    })
  })

  describe('when there is an error', () => {
    it('should display the ErrorComponent', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/messaging/health/allrecipients')
        .mockRejectedValue({ networkError: true } as api.APIError)
        .calledWith('/v0/messaging/health/messages/signature')
        .mockRejectedValue({ networkError: true } as api.APIError)
      initializeTestInstance()
      await waitFor(() => expect(screen.getByText(t('errors.networkConnection.header'))).toBeTruthy())
    })
  })

  describe('when the subject is general', () => {
    it('should add the text (*Required) for the subject line field', async () => {
      initializeApiCalls(facilities)
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByTestId('picker')))
      fireEvent.press(screen.getByTestId(t('secureMessaging.startNewMessage.general')))
      fireEvent.press(screen.getByLabelText(t('done')))
      await waitFor(() =>
        expect(screen.getByText(`${t('secureMessaging.startNewMessage.subject')} ${t('required')}`)).toBeTruthy(),
      )
    })
  })

  describe('when pressing the back button', () => {
    it('should go to inbox if all fields empty', async () => {
      initializeApiCalls(facilities)
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByText(t('cancel'))))
      await waitFor(() => expect(goBack).toHaveBeenCalled())
    })

    it('should ask for confirmation if any field filled in', async () => {
      initializeApiCalls(facilities)
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByTestId('picker')))
      fireEvent.press(screen.getByTestId(t('secureMessaging.startNewMessage.general')))
      fireEvent.press(screen.getByLabelText(t('done')))
      fireEvent.press(screen.getByText(t('cancel')))
      await waitFor(() => expect(mockUseComposeCancelConfirmationSpy).toHaveBeenCalled())
    })
  })

  describe('on click of save (draft)', () => {
    describe('when a required field is not filled', () => {
      it('should display a field error for that field and an AlertBox', async () => {
        initializeApiCalls(facilities)
        initializeTestInstance()
        await waitFor(() => fireEvent.press(screen.getByText(t('save'))))
        await waitFor(() =>
          expect(screen.getAllByText(t('secureMessaging.startNewMessage.to.fieldError'))).toBeTruthy(),
        )
        expect(screen.getAllByText(t('secureMessaging.startNewMessage.category.fieldError'))).toBeTruthy()
        expect(screen.getAllByText(t('secureMessaging.formMessage.message.fieldError'))).toBeTruthy()
        expect(screen.getByText(t('secureMessaging.formMessage.weNeedMoreInfo'))).toBeTruthy()
        expect(screen.getByText(t('secureMessaging.formMessage.saveDraft.validation.text'))).toBeTruthy()
      })
    })
  })

  describe('when user has multiple facilities on record', () => {
    it('should display select a care system', async () => {
      initializeApiCalls(facilities)
      initializeTestInstance()
      await waitFor(() => expect(screen.queryAllByText('Pick a care system (Required)').length).toBe(1))
    })
  })

  describe('when user has only one facility on record', () => {
    it('should hide select a care system', async () => {
      initializeApiCalls(singleFacility)
      initializeTestInstance()
      await waitFor(() => expect(screen.queryAllByText('Pick a care system (Required)').length).toBe(0))
    })
  })

  describe('on click of send', () => {
    describe('when a required field is not filled', () => {
      it('should display a field error for that field and an AlertBox', async () => {
        initializeApiCalls(facilities)
        initializeTestInstance()
        await waitFor(() => fireEvent.press(screen.getByText(t('secureMessaging.formMessage.send'))))
        await waitFor(() =>
          expect(screen.getAllByText(t('secureMessaging.startNewMessage.to.fieldError'))).toBeTruthy(),
        )
        expect(screen.getAllByText(t('secureMessaging.startNewMessage.category.fieldError'))).toBeTruthy()
        expect(screen.getAllByText(t('secureMessaging.formMessage.message.fieldError'))).toBeTruthy()
        expect(screen.getByText(t('secureMessaging.formMessage.weNeedMoreInfo'))).toBeTruthy()
        expect(screen.getByText(t('secureMessaging.formMessage.sendMessage.validation.text'))).toBeTruthy()
      })
    })
  })

  describe('on click of add files button', () => {
    it('should call useRouteNavigation', async () => {
      initializeApiCalls(facilities)
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByLabelText(t('secureMessaging.formMessage.addFiles'))))
      await waitFor(() => expect(mockNavigationSpy).toHaveBeenCalled())
    })
  })

  describe('when displaying the form', () => {
    it('should display an alert about urgent messages', async () => {
      initializeApiCalls(facilities)
      initializeTestInstance()
      await waitFor(() =>
        expect(
          screen.getAllByText(
            t('secureMessaging.startNewMessage.nonurgent.careTeam') +
              t('secureMessaging.startNewMessage.nonurgent.threeDays') +
              t('secureMessaging.startNewMessage.nonurgent.reply'),
          ),
        ).toBeTruthy(),
      )
    })
  })
})
