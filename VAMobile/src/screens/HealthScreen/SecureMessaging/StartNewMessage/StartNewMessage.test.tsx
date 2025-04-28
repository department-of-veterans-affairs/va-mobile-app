import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { SecureMessagingRecipients, SecureMessagingSignatureData } from 'api/types'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'

import StartNewMessage from './StartNewMessage'

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

  describe('when no recipients are returned', () => {
    it('should display an AlertBox', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/messaging/health/recipients')
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
        .calledWith('/v0/messaging/health/recipients')
        .mockRejectedValue({ networkError: true } as api.APIError)
        .calledWith('/v0/messaging/health/messages/signature')
        .mockRejectedValue({ networkError: true } as api.APIError)
      initializeTestInstance()
      await waitFor(() => expect(screen.getByText(t('errors.networkConnection.header'))).toBeTruthy())
    })
  })

  describe('when the subject is general', () => {
    it('should add the text (*Required) for the subject line field', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/messaging/health/recipients')
        .mockResolvedValue(recipients)
        .calledWith('/v0/messaging/health/messages/signature')
        .mockResolvedValue(signature)
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
      when(api.get as jest.Mock)
        .calledWith('/v0/messaging/health/recipients')
        .mockResolvedValue(recipients)
        .calledWith('/v0/messaging/health/messages/signature')
        .mockResolvedValue(signature)
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByText(t('cancel'))))
      await waitFor(() => expect(goBack).toHaveBeenCalled())
    })

    it('should ask for confirmation if any field filled in', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/messaging/health/recipients')
        .mockResolvedValue(recipients)
        .calledWith('/v0/messaging/health/messages/signature')
        .mockResolvedValue(signature)
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
        when(api.get as jest.Mock)
          .calledWith('/v0/messaging/health/recipients')
          .mockResolvedValue(recipients)
          .calledWith('/v0/messaging/health/messages/signature')
          .mockResolvedValue(signature)
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

  describe('on click of send', () => {
    describe('when a required field is not filled', () => {
      it('should display a field error for that field and an AlertBox', async () => {
        when(api.get as jest.Mock)
          .calledWith('/v0/messaging/health/recipients')
          .mockResolvedValue(recipients)
          .calledWith('/v0/messaging/health/messages/signature')
          .mockResolvedValue(signature)
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
      when(api.get as jest.Mock)
        .calledWith('/v0/messaging/health/recipients')
        .mockResolvedValue(recipients)
        .calledWith('/v0/messaging/health/messages/signature')
        .mockResolvedValue(signature)
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByLabelText(t('secureMessaging.formMessage.addFiles'))))
      await waitFor(() => expect(mockNavigationSpy).toHaveBeenCalled())
    })
  })

  describe('when displaying the form', () => {
    it('should display an alert about urgent messages', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/messaging/health/recipients')
        .mockResolvedValue(recipients)
        .calledWith('/v0/messaging/health/messages/signature')
        .mockResolvedValue(signature)
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
