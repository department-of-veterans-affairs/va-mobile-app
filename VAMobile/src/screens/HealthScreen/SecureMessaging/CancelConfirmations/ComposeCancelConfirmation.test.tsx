import React from 'react'

import { context, render } from 'testUtils'
import { useComposeCancelConfirmation } from './ComposeCancelConfirmation'
import { SecureMessagingFormData } from 'store/api'
import { FormHeaderType, FormHeaderTypeConstants } from 'constants/secureMessaging'
import { CategoryTypeFields } from 'store/api/types'
import { useDestructiveActionSheetProps } from 'utils/hooks'

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

  const initializeTestInstance = (
    messageData: SecureMessagingFormData = {} as SecureMessagingFormData,
    draftMessageID: number = 0,
    isFormValid: boolean = true,
    origin: FormHeaderType = FormHeaderTypeConstants.compose,
    replyToID?: number,
  ) => {

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
    render(<TestComponent />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('New Message', () => {
    describe('on clicking discard', () => {
      it('should go back to the previous page', () => {
        discardButtonSpy()
        expect(mockNavigationSpy).toHaveBeenCalledWith('SecureMessaging')
      })
    })

    describe('on clicking save draft', () => {
      it('should go back to compose if form not valid', () => {
        initializeTestInstance(undefined, undefined, false)
        saveDraftButtonSpy()
        expect(mockNavigationSpy).toHaveBeenCalledWith('StartNewMessage', expect.objectContaining({ saveDraftConfirmFailed: true }))
      })
    })
  })

  describe('Reply', () => {
    describe('on clicking discard', () => {
      it('should go back to the message the user was viewing', () => {
        initializeTestInstance({ body: 'test reply', category: CategoryTypeFields.appointment }, undefined, true, FormHeaderTypeConstants.reply, 2)
        discardButtonSpy()
        expect(mockNavigationSpy).toHaveBeenCalledWith('ViewMessage', { messageID: 2 })
      })
    })

    describe('on clicking save draft', () => {
      it('should go back to compose if form not valid', () => {
        initializeTestInstance(undefined, undefined, false)
        saveDraftButtonSpy()
        expect(mockNavigationSpy).toHaveBeenCalledWith('StartNewMessage', expect.objectContaining({ saveDraftConfirmFailed: true }))
      })
    })
  })

  describe('Draft', () => {
    describe('on clicking discard', () => {
      it('should go back to drafts folder', () => {
        initializeTestInstance({ body: 'test reply', category: CategoryTypeFields.appointment }, 1, true, FormHeaderTypeConstants.draft, undefined)
        discardButtonSpy()
        expect(mockNavigationSpy).toHaveBeenCalledWith('FolderMessages', { draftSaved: false, folderID: -2, folderName: 'Drafts' })
      })
    })

    describe('on clicking save draft', () => {
      it('should go back to compose if form not valid', () => {
        initializeTestInstance(undefined, undefined, false)
        saveDraftButtonSpy()
        expect(mockNavigationSpy).toHaveBeenCalledWith('StartNewMessage', expect.objectContaining({ saveDraftConfirmFailed: true }))
      })
    })
  })
})
