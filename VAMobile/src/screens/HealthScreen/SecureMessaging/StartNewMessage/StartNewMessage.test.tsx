import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types'
import { InitialState, initializeErrorsByScreenID, saveDraft, updateSecureMessagingTab } from 'store/slices'
import { context, mockNavProps, render } from 'testUtils'

import StartNewMessage from './StartNewMessage'

const mockNavigationSpy = jest.fn()
jest.mock('../../../../utils/hooks', () => {
  const original = jest.requireActual('../../../../utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('store/slices', () => {
  const actual = jest.requireActual('store/slices')
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
    getMessageRecipients: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
    resetSendMessageFailed: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
    SecureMessagingState: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
    resetSaveDraftComplete: jest.fn(() => {
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

  const initializeTestInstance = (
    screenID = ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID,
    noRecipientsReturned = false,
    sendMessageFailed: boolean = false,
    hasLoadedRecipients: boolean = true,
    params: object = { attachmentFileToAdd: {} },
  ) => {
    goBack = jest.fn()
    const errorsByScreenID = initializeErrorsByScreenID()
    errorsByScreenID[screenID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

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

    render(<StartNewMessage {...props} />, {
      preloadedState: {
        ...InitialState,
        secureMessaging: {
          ...InitialState.secureMessaging,
          signature: {
            signatureName: 'signatureName',
            includeSignature: false,
            signatureTitle: 'Title',
          },
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
        },
        errors: {
          ...InitialState.errors,
          errorsByScreenID,
        },
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('when no recipients are returned', () => {
    beforeEach(() => {
      // need to use a different screenID otherwise useError will render the error component instead
      initializeTestInstance(ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID, true, false, true)
    })

    it('should display an AlertBox', () => {
      expect(screen.getByText("We can't match you with a provider")).toBeTruthy()
      expect(
        screen.getByText(
          "We're sorry. To send a Secure Message, both you and your VA primary care provider must be enrolled in the Secure Messaging program. Please contact your primary care provider to see if they are enrolled and can enroll you in the program.",
        ),
      ).toBeTruthy()
    })

    describe('on click of the go to inbox link', () => {
      it('should call useRouteNavigation and updateSecureMessagingTab', () => {
        fireEvent.press(screen.getByRole('link', { name: 'Go to inbox' }))
        expect(mockNavigationSpy).toHaveBeenCalledWith('SecureMessaging')
        expect(updateSecureMessagingTab).toHaveBeenCalled()
      })
    })
  })

  describe('when hasLoadedRecipients is false', () => {
    it('should display the LoadingComponent', () => {
      initializeTestInstance(ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID, true, false, false)
      expect(screen.getByText('Loading a new message...')).toBeTruthy()
    })
  })

  describe('when there is an error', () => {
    it('should display the ErrorComponent', () => {
      initializeTestInstance(ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID)
      expect(screen.getByText("The app can't be loaded.")).toBeTruthy()
    })
  })

  describe('when returning from confirmation screen', () => {
    it('should show Recheck Info if validation had failed', () => {
      initializeTestInstance(undefined, undefined, undefined, undefined, { saveDraftConfirmFailed: true })
      fireEvent.press(screen.getByText('Save'))
      expect(screen.getByText('We need more information')).toBeTruthy()
    })
  })

  describe('on click of the collapsible view', () => {
    it('should show the Reply Help panel', () => {
      fireEvent.press(screen.getByLabelText('Only use messages for non-urgent needs'))
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('when the subject is general', () => {
    it('should add the text (*Required) for the subject line field', () => {
      fireEvent.press(screen.getByTestId('picker'))
      fireEvent.press(screen.getByTestId('General'))
      fireEvent.press(screen.getByLabelText('Done'))
      expect(screen.getByText('Subject (Required)')).toBeTruthy()
    })
  })

  describe('when pressing the back button', () => {
    it('should go to inbox if all fields empty', () => {
      fireEvent.press(screen.getByText('Cancel'))
      expect(goBack).toHaveBeenCalled()
    })

    it('should ask for confirmation if any field filled in', () => {
      fireEvent.press(screen.getByTestId('picker'))
      fireEvent.press(screen.getByTestId('General'))
      fireEvent.press(screen.getByLabelText('Done'))
      fireEvent.press(screen.getByText('Cancel'))
      expect(mockUseComposeCancelConfirmationSpy).toHaveBeenCalled()
    })
  })

  describe('on click of save (draft)', () => {
    describe('when a required field is not filled', () => {
      beforeEach(() => {
        fireEvent.press(screen.getByText('Save'))
      })

      it('should display a field error for that field and an AlertBox', () => {
        expect(screen.getAllByText('Select a care team to message')).toBeTruthy()
        expect(screen.getAllByText('Select a category')).toBeTruthy()
        expect(screen.getAllByText('Enter a message')).toBeTruthy()
        expect(screen.getByText('We need more information')).toBeTruthy()
        expect(screen.getByText('To save this message, provide this information:')).toBeTruthy()
      })
    })
  })

  describe('when form fields are filled out correctly and saved', () => {
    it('should call saveDraft', () => {
      fireEvent.press(screen.getByTestId('to field'))
      fireEvent.press(screen.getByTestId('Doctor 1'))
      fireEvent.press(screen.getByLabelText('Done'))
      fireEvent.press(screen.getByTestId('picker'))
      fireEvent.press(screen.getByTestId('Appointment'))
      fireEvent.press(screen.getByLabelText('Done'))
      fireEvent.changeText(screen.getByTestId('message field'), 'test')
      fireEvent.press(screen.getByText('Save'))
      expect(saveDraft).toHaveBeenCalled()
    })
  })

  describe('on click of send', () => {
    describe('when a required field is not filled', () => {
      beforeEach(() => {
        fireEvent.press(screen.getByText('Send'))
      })

      it('should display a field error for that field and an AlertBox', () => {
        expect(screen.getAllByText('Select a care team to message')).toBeTruthy()
        expect(screen.getAllByText('Select a category')).toBeTruthy()
        expect(screen.getAllByText('Enter a message')).toBeTruthy()
        expect(screen.getByText('We need more information')).toBeTruthy()
        expect(screen.getByText('To send this message, provide this information:')).toBeTruthy()
      })
    })
  })

  describe('on click of add files button', () => {
    it('should call useRouteNavigation', () => {
      fireEvent.press(screen.getByLabelText('Add Files'))
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })
})
