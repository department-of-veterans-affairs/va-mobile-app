import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, mockNavProps, renderWithProviders, findByTypeWithName } from 'testUtils'
import ComposeCancelConfirmation from './ComposeCancelConfirmation'
import { TouchableWithoutFeedback } from 'react-native'
import { SecureMessagingFormData } from 'store/api'
import { VAButton } from 'components'
import { FormHeaderType, FormHeaderTypeConstants } from 'constants/secureMessaging'

let mockNavigationSpy = jest.fn(() => {
  return jest.fn()
})

jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  let theme = jest.requireActual('styles/themes/standardTheme').default
  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('store/actions', () => {
  let actual = jest.requireActual('store/actions')
  return {
    ...actual,
    updateSecureMessagingTab: jest.fn(() => {
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
    resetHasLoadedRecipients: jest.fn(() => {
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
    resetSaveDraftFailed: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

context('ComposeCancelConfirmation', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any
  let goBack: jest.Mock

  const _ = undefined
  const initializeTestInstance = (
    messageData: SecureMessagingFormData = {} as SecureMessagingFormData,
    draftMessageID: number = 0,
    isFormValid: boolean = true,
    origin: FormHeaderType = FormHeaderTypeConstants.compose,
    replyToID?: number,
  ) => {
    goBack = jest.fn()

    props = mockNavProps(
      undefined,
      {
        setOptions: jest.fn(),
        navigate: mockNavigationSpy,
        goBack,
      },
      {
        params: {
          messageData,
          draftMessageID,
          isFormValid,
          origin,
          replyToID,
        },
      },
    )

    act(() => {
      component = renderWithProviders(<ComposeCancelConfirmation {...props} />)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
  describe('on click of the crisis line banner', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findByType(TouchableWithoutFeedback).props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('New Message', () => {
    describe('on clicking discard', () => {
      it('should go back to the previous page', async () => {
        act(() => {
          findByTypeWithName(testInstance, VAButton, 'Discard')?.props.onPress()
        })
        expect(mockNavigationSpy).toHaveBeenCalledWith('SecureMessaging')
      })
    })

    describe('on clicking save draft', () => {
      it('should go back to compose if form not valid', async () => {
        initializeTestInstance(_, _, false)
        act(() => {
          findByTypeWithName(testInstance, VAButton, 'Save draft')?.props.onPress()
        })
        expect(mockNavigationSpy).toHaveBeenCalledWith('ComposeMessage', expect.objectContaining({ saveDraftConfirmFailed: true }))
      })

      it('should save and go to drafts folder', async () => {
        act(() => {
          findByTypeWithName(testInstance, VAButton, 'Save draft')?.props.onPress()
        })
        expect(mockNavigationSpy).toHaveBeenCalledWith('SecureMessaging')
        expect(mockNavigationSpy).toHaveBeenCalledWith('FolderMessages', expect.objectContaining({ draftSaved: true }))
      })
    })
  })

  describe('Reply', () => {
    describe('on clicking discard', () => {
      it('should go back to the message the user was viewing', async () => {
        initializeTestInstance({ body: 'test reply' }, _, true, FormHeaderTypeConstants.reply, 2)
        act(() => {
          findByTypeWithName(testInstance, VAButton, 'Discard')?.props.onPress()
        })
        expect(mockNavigationSpy).toHaveBeenCalledWith('ViewMessageScreen', { messageID: 2 })
      })
    })

    describe('on clicking save draft', () => {
      it('should save and go to drafts folder', async () => {
        initializeTestInstance({ body: 'test reply' }, _, true, FormHeaderTypeConstants.reply, 2)
        act(() => {
          findByTypeWithName(testInstance, VAButton, 'Save draft')?.props.onPress()
        })
        expect(mockNavigationSpy).toHaveBeenCalledWith('SecureMessaging')
        expect(mockNavigationSpy).toHaveBeenCalledWith('FolderMessages', expect.objectContaining({ draftSaved: true }))
      })
    })
  })

  describe('Draft', () => {
    describe('on clicking discard', () => {
      it('should go back to drafts folder', async () => {
        initializeTestInstance({ body: 'test reply' }, 1, true, FormHeaderTypeConstants.draft, _)
        act(() => {
          findByTypeWithName(testInstance, VAButton, 'Discard')?.props.onPress()
        })
        expect(mockNavigationSpy).toHaveBeenCalledWith('FolderMessages', { draftSaved: false, folderID: -2, folderName: 'Drafts' })
      })
    })

    describe('on clicking save draft', () => {
      it('should save and go to drafts folder', async () => {
        initializeTestInstance({ body: 'test reply' }, 1, true, FormHeaderTypeConstants.draft, _)
        act(() => {
          findByTypeWithName(testInstance, VAButton, 'Save draft')?.props.onPress()
        })
        expect(mockNavigationSpy).toHaveBeenCalledWith('FolderMessages', { draftSaved: true, folderID: -2, folderName: 'Drafts' })
      })
    })
  })
})
