import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

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
      expect(screen.getByText('Loading a new message...')).toBeTruthy()
      await waitFor(() => expect(screen.getByText("We can't match you with a provider")).toBeTruthy())
      await waitFor(() =>
        expect(
          screen.getByText(
            "We're sorry. To send a Secure Message, both you and your VA primary care provider must be enrolled in the Secure Messaging program. Please contact your primary care provider to see if they are enrolled and can enroll you in the program.",
          ),
        ).toBeTruthy(),
      )
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: 'Go to inbox' })))
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
      await waitFor(() => expect(screen.getByText("The app can't be loaded.")).toBeTruthy())
    })
  })

  describe('on click of the collapsible view', () => {
    it('should show the Reply Help panel', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/messaging/health/recipients')
        .mockResolvedValue(recipients)
        .calledWith('/v0/messaging/health/messages/signature')
        .mockResolvedValue(signature)
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByLabelText('Only use messages for non-urgent needs')))
      await waitFor(() => expect(mockNavigationSpy).toHaveBeenCalled())
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
      await waitFor(() => fireEvent.press(screen.getByTestId('General')))
      await waitFor(() => fireEvent.press(screen.getByLabelText('Done')))
      await waitFor(() => expect(screen.getByText('Subject (Required)')).toBeTruthy())
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
      await waitFor(() => fireEvent.press(screen.getByText('Cancel')))
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
      await waitFor(() => fireEvent.press(screen.getByTestId('General')))
      await waitFor(() => fireEvent.press(screen.getByLabelText('Done')))
      await waitFor(() => fireEvent.press(screen.getByText('Cancel')))
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
        await waitFor(() => fireEvent.press(screen.getByText('Save')))
        await waitFor(() => expect(screen.getAllByText('Select a care team to message')).toBeTruthy())
        await waitFor(() => expect(screen.getAllByText('Select a category')).toBeTruthy())
        await waitFor(() => expect(screen.getAllByText('Enter a message')).toBeTruthy())
        await waitFor(() => expect(screen.getByText('We need more information')).toBeTruthy())
        await waitFor(() => expect(screen.getByText('To save this message, provide this information:')).toBeTruthy())
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
        await waitFor(() => fireEvent.press(screen.getByText('Send')))
        await waitFor(() => expect(screen.getAllByText('Select a care team to message')).toBeTruthy())
        await waitFor(() => expect(screen.getAllByText('Select a category')).toBeTruthy())
        await waitFor(() => expect(screen.getAllByText('Enter a message')).toBeTruthy())
        await waitFor(() => expect(screen.getByText('We need more information')).toBeTruthy())
        await waitFor(() => expect(screen.getByText('To send this message, provide this information:')).toBeTruthy())
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
      await waitFor(() => fireEvent.press(screen.getByLabelText('Add Files')))
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
      await waitFor(() => expect(screen.getAllByText('Only use messages for non-urgent needs')).toBeTruthy())
    })
  })
})
