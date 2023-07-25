import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, mockNavProps, render, RenderAPI } from 'testUtils'
import { useComposeCancelConfirmation } from './ComposeCancelConfirmation'
import { SecureMessagingFormData } from 'store/api'
import { FormHeaderType, FormHeaderTypeConstants } from 'constants/secureMessaging'
import { CategoryTypeFields } from 'store/api/types'
import { useDestructiveActionSheetProps } from 'utils/hooks'
import { when } from 'jest-when'

let mockNavigationSpy = jest.fn()

let discardButtonSpy: any
let saveDraftButtonSpy: any
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useDestructiveActionSheet: () => {
      // grab a reference to the parameters passed in to test cancel and discard functionality
      return (props: useDestructiveActionSheetProps) => {
        discardButtonSpy = props.buttons[1].onPress
        saveDraftButtonSpy = props.buttons[2].onPress
      }
    },
    useRouteNavigation: () => mockNavigationSpy,
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
  }
})

context('useComposeCancelConfirmation', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let navigateToSecureMessagingSpy: jest.Mock
  let navigateToStartNewMessageSpy: jest.Mock
  let navigateToViewMessageScreenSpy: jest.Mock
  let navigateToDraftFolderNotSavedSpy: jest.Mock
  let navigateToDraftFolderSavedSpy: jest.Mock

  const initializeTestInstance = (
    messageData: SecureMessagingFormData = {} as SecureMessagingFormData,
    draftMessageID: number = 0,
    isFormValid: boolean = true,
    origin: FormHeaderType = FormHeaderTypeConstants.compose,
    replyToID?: number,
  ) => {
    navigateToSecureMessagingSpy = jest.fn()
    navigateToStartNewMessageSpy = jest.fn()
    navigateToViewMessageScreenSpy = jest.fn()
    navigateToDraftFolderNotSavedSpy = jest.fn()
    navigateToDraftFolderSavedSpy = jest.fn()

    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('SecureMessaging')
      .mockReturnValue(navigateToSecureMessagingSpy)
      .calledWith('StartNewMessage', expect.objectContaining({ saveDraftConfirmFailed: true }))
      .mockReturnValue(navigateToStartNewMessageSpy)
      .calledWith('FolderMessages', expect.objectContaining({ draftSaved: true }))
      .mockReturnValue(navigateToDraftFolderSavedSpy)
      .calledWith('ViewMessageScreen', { messageID: 2 })
      .mockReturnValue(navigateToViewMessageScreenSpy)
      .calledWith('FolderMessages', { draftSaved: false, folderID: -2, folderName: 'Drafts' })
      .mockReturnValue(navigateToDraftFolderNotSavedSpy)

    const TestComponent: React.FC = () => {
      const [_, alert] = useComposeCancelConfirmation()
      alert({
        messageData,
        draftMessageID,
        isFormValid,
        origin,
        replyToID,
      })
      return <></>
    }

    component = render(<TestComponent />)

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
  describe('New Message', () => {
    describe('on clicking discard', () => {
      it('should go back to the previous page', async () => {
        act(() => {
          discardButtonSpy()
        })
        expect(navigateToSecureMessagingSpy).toHaveBeenCalled()
      })
    })

    describe('on clicking save draft', () => {
      it('should go back to compose if form not valid', async () => {
        initializeTestInstance(undefined, undefined, false)
        act(() => {
          saveDraftButtonSpy()
        })
        expect(navigateToStartNewMessageSpy).toHaveBeenCalled()
      })
    })
  })

  describe('Reply', () => {
    describe('on clicking discard', () => {
      it('should go back to the message the user was viewing', async () => {
        initializeTestInstance({ body: 'test reply', category: CategoryTypeFields.appointment }, undefined, true, FormHeaderTypeConstants.reply, 2)
        act(() => {
          discardButtonSpy()
        })
        expect(navigateToViewMessageScreenSpy).toHaveBeenCalled()
      })
    })

    describe('on clicking save draft', () => {
      it('should go back to compose if form not valid', async () => {
        initializeTestInstance(undefined, undefined, false)
        act(() => {
          saveDraftButtonSpy()
        })
        expect(navigateToStartNewMessageSpy).toHaveBeenCalled()
      })
    })
  })

  describe('Draft', () => {
    describe('on clicking discard', () => {
      it('should go back to drafts folder', async () => {
        initializeTestInstance({ body: 'test reply', category: CategoryTypeFields.appointment }, 1, true, FormHeaderTypeConstants.draft, undefined)
        act(() => {
          discardButtonSpy()
        })
        expect(navigateToDraftFolderNotSavedSpy).toHaveBeenCalled()
      })
    })

    describe('on clicking save draft', () => {
      it('should go back to compose if form not valid', async () => {
        initializeTestInstance(undefined, undefined, false)
        act(() => {
          saveDraftButtonSpy()
        })
        expect(navigateToStartNewMessageSpy).toHaveBeenCalled()
      })
    })
  })
})
