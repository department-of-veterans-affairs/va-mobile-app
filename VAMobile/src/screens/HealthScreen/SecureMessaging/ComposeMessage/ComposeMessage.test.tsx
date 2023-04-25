import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'
import { StackNavigationOptions } from '@react-navigation/stack/lib/typescript/src/types'

import * as api from 'store/api'
import { context, findByTypeWithText, mockNavProps, render, RenderAPI, waitFor } from 'testUtils'
import ComposeMessage from './ComposeMessage'
import { Pressable, TouchableWithoutFeedback } from 'react-native'
import { AlertBox, ErrorComponent, FormWrapper, LoadingComponent, TextView, VAModalPicker, VATextInput } from 'components'
import { initializeErrorsByScreenID, InitialState, saveDraft, updateSecureMessagingTab } from 'store/slices'
import { CategoryTypeFields, ScreenIDTypesConstants } from 'store/api/types'
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
  }
})

let mockUseComposeCancelConfirmationSpy = jest.fn()
jest.mock('../CancelConfirmations/ComposeCancelConfirmation', () => {
  let original = jest.requireActual('utils/hooks')
  let theme = jest.requireActual('styles/themes/standardTheme').default
  return {
    ...original,
    useComposeCancelConfirmation: () => [false, mockUseComposeCancelConfirmationSpy],
  }
})

context('ComposeMessage', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any
  let goBack: jest.Mock
  let navHeaderSpy: any
  let navigateSpy: jest.Mock
  let navigateToAddToFilesSpy: jest.Mock
  let navigateToHowToAttachSpy: jest.Mock
  let navigateToVeteransCrisisLineSpy: jest.Mock

  const initializeTestInstance = (
    screenID = ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID,
    noRecipientsReturned = false,
    sendMessageFailed: boolean = false,
    hasLoadedRecipients: boolean = true,
    params: Object = { attachmentFileToAdd: {} },
  ) => {
    goBack = jest.fn()
    navigateSpy = jest.fn()
    navigateToAddToFilesSpy = jest.fn()
    navigateToHowToAttachSpy = jest.fn()
    navigateToVeteransCrisisLineSpy = jest.fn()
    const errorsByScreenID = initializeErrorsByScreenID()
    errorsByScreenID[screenID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('Attachments', { origin: 'Compose', attachmentsList: [] })
      .mockReturnValue(navigateToAddToFilesSpy)
      .calledWith('AttachmentsFAQ', { originHeader: 'Compose' })
      .mockReturnValue(navigateToHowToAttachSpy)
      .calledWith('VeteransCrisisLine')
      .mockReturnValue(navigateToVeteransCrisisLineSpy)

    props = mockNavProps(
      undefined,
      {
        addListener: mockUseComposeCancelConfirmationSpy,
        navigate: navigateSpy,
        goBack,
        setOptions: (options: Partial<StackNavigationOptions>) => {
          navHeaderSpy = {
            back: options.headerLeft ? options.headerLeft({}) : undefined,
            save: options.headerRight ? options.headerRight({}) : undefined,
          }
        },
      },
      { params: params },
    )

    component = render(<ComposeMessage {...props} />, {
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

    testInstance = component.container
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    await waitFor(() => {
      expect(component).toBeTruthy()
    })
  })

  describe('when no recipients are returned', () => {
    beforeEach(() => {
      // need to use a different screenID otherwise useError will render the error component instead
      initializeTestInstance(ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID, true, false, true)
    })

    it('should display an AlertBox', async () => {
      await waitFor(() => {
        expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      })
    })

    describe('on click of the go to inbox button', () => {
      it('should call useRouteNavigation and updateSecureMessagingTab', async () => {
        await waitFor(() => {
          testInstance.findByProps({ label: 'Go to inbox' }).props.onPress()
          expect(navigateSpy).toHaveBeenCalledWith('SecureMessaging')
          expect(updateSecureMessagingTab).toHaveBeenCalled()
        })
      })
    })
  })

  describe('when hasLoadedRecipients is false', () => {
    it('should display the LoadingComponent', async () => {
      await waitFor(() => {
        initializeTestInstance(ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID, true, false, false)
        expect(testInstance.findAllByType(LoadingComponent).length).toEqual(1)
      })
    })
  })

  describe('when there is an error', () => {
    it('should display the ErrorComponent', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/messaging/health/recipients')
        .mockRejectedValue({ networkError: true } as api.APIError)

      await waitFor(() => {
        initializeTestInstance(ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID)
        expect(testInstance.findAllByType(ErrorComponent).length).toEqual(1)
      })
    })
  })

  describe('on click of the crisis line banner', () => {
    it('should call useRouteNavigation', async () => {
      await waitFor(() => {
        testInstance.findAllByType(TouchableWithoutFeedback)[2].props.onPress()
        expect(navigateToVeteransCrisisLineSpy).toHaveBeenCalled()
      })
    })
  })

  describe('when returning from confirmation screen', () => {
    it('should show Recheck Info if validation had failed', async () => {
      initializeTestInstance(undefined, undefined, undefined, undefined, { saveDraftConfirmFailed: true })
      await waitFor(() => {
        navHeaderSpy.save.props.onSave()

        expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
        expect(findByTypeWithText(testInstance, TextView, 'Recheck information')).toBeTruthy()
      })
    })
  })

  describe('on click of the collapsible view', () => {
    it('should display the when will i get a reply children text', async () => {
      await waitFor(() => {
        testInstance.findAllByType(Pressable)[0].props.onPress()

        expect(
          findByTypeWithText(
            testInstance,
            TextView,
            'It can take up to three business days to receive a response from a member of your health care team or the administrative VA staff member you contacted.',
          ),
        ).toBeTruthy()
      })
    })
  })

  describe('when the subject is general', () => {
    it('should add the text (*Required) for the subject line field', async () => {
      await waitFor(() => {
        testInstance.findAllByType(VAModalPicker)[1].props.onSelectionChange(CategoryTypeFields.other)
      })

      const textViews = testInstance.findAllByType(TextView)

      expect(textViews[12].props.children).toEqual(['Subject', ' ', '(Required)'])
    })
  })

  describe('when pressing the back button', () => {
    it('should go to inbox if all fields empty', async () => {
      await waitFor(() => {
        testInstance.findAllByType(VATextInput)[0].props.onChange('')

        navHeaderSpy.back.props.onPress()
        expect(goBack).toHaveBeenCalled()
      })
    })

    it('should ask for confirmation if any field filled in', async () => {
      await waitFor(() => {
        testInstance.findAllByType(VATextInput)[0].props.onChange('Random string')
      })

      await waitFor(() => {
        navHeaderSpy.back.props.onPress()
        expect(mockUseComposeCancelConfirmationSpy).toHaveBeenCalled()
      })
    })
  })

  describe('on click of save (draft)', () => {
    describe('when a required field is not filled', () => {
      beforeEach(async () => {
        await waitFor(() => {
          navHeaderSpy.save.props.onSave()
          testInstance.findByType(FormWrapper).props.onSave(true)
        })
      })

      it('should display a field error for that field', async () => {
        await waitFor(() => {
          expect(findByTypeWithText(testInstance, TextView, 'Select a recipient')).toBeTruthy()
          expect(findByTypeWithText(testInstance, TextView, 'Subject is required')).toBeTruthy()
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
  })

  describe('when form fields are filled out correctly and saved', () => {
    it('should call saveDraft', async () => {
      await waitFor(() => {
        navHeaderSpy.save.props.onSave()

        testInstance.findByType(FormWrapper).props.onSave(true)
        expect(saveDraft).toHaveBeenCalled()
      })
    })
  })

  describe('on click of send', () => {
    describe('when a required field is not filled', () => {
      beforeEach(async () => {
        await waitFor(() => {
          testInstance.findByProps({ label: 'Send' }).props.onPress()
        })
      })

      it('should display a field error for that field', async () => {
        await waitFor(() => {
          expect(findByTypeWithText(testInstance, TextView, 'Select a recipient')).toBeTruthy()
          expect(findByTypeWithText(testInstance, TextView, 'Subject is required')).toBeTruthy()
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

  describe('when the subject changes from general to another option', () => {
    it('should clear all field errors', async () => {
      await waitFor(() => {
        testInstance.findByProps({ label: 'Send' }).props.onPress()
      })

      expect(findByTypeWithText(testInstance, TextView, 'Select a recipient')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Subject is required')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'The message cannot be blank')).toBeTruthy()

      await waitFor(() => {
        testInstance.findAllByType(VAModalPicker)[1].props.onSelectionChange(CategoryTypeFields.other)
      })

      await waitFor(() => {
        testInstance.findAllByType(VAModalPicker)[1].props.onSelectionChange(CategoryTypeFields.covid)
      })

      expect(findByTypeWithText(testInstance, TextView, 'Select a recipient')).toBeFalsy()
      expect(findByTypeWithText(testInstance, TextView, 'Subject is required')).toBeFalsy()
      expect(findByTypeWithText(testInstance, TextView, 'The message cannot be blank')).toBeFalsy()
      expect(findByTypeWithText(testInstance, TextView, 'Attachments')).toBeTruthy()
    })
  })

  describe('on click of add files button', () => {
    it('should call useRouteNavigation', async () => {
      await waitFor(() => {
        testInstance.findByProps({ label: 'Add Files' }).props.onPress()
        expect(navigateToAddToFilesSpy).toHaveBeenCalled()
      })
    })
  })
})
