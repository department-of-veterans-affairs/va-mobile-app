import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, mockNavProps, renderWithProviders } from 'testUtils'
import { useComposeCancelConfirmation} from './ComposeCancelConfirmation'
import { SecureMessagingFormData } from 'store/api'
import { FormHeaderType, FormHeaderTypeConstants } from 'constants/secureMessaging'
import { UseDestructiveAlertProps } from 'utils/hooks'

let mockNavigationSpy = jest.fn(() => {
  return jest.fn()
})

let discardButtonSpy: any
let saveDraftButtonSpy : any
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  let theme = jest.requireActual('styles/themes/standardTheme').default
  return {
    ...original,
    useDestructiveAlert: () => {
      // grab a reference to the parameters passed in to test cancel and discard functionality
      return (props: UseDestructiveAlertProps) => {
        discardButtonSpy = props.buttons[0].onPress
        saveDraftButtonSpy = props.buttons[1].onPress
      }
    },
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

context('useComposeCancelConfirmation', () => {
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (
    messageData: SecureMessagingFormData = {} as SecureMessagingFormData,
    draftMessageID: number = 0,
    isFormValid: boolean = true,
    origin: FormHeaderType = FormHeaderTypeConstants.compose,
    replyToID?: number,
  ) => {
    const TestComponent: React.FC = () => {
      const alert = useComposeCancelConfirmation()
      alert({
        messageData,
        draftMessageID,
        isFormValid,
        origin,
        replyToID
      })
      return <></>
    }
    act(() => {
      component = renderWithProviders(<TestComponent />)
    })

    testInstance = component.root
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
        expect(mockNavigationSpy).toHaveBeenCalledWith('SecureMessaging')
      })
    })

    describe('on clicking save draft', () => {
      it('should go back to compose if form not valid', async () => {
        initializeTestInstance(undefined, undefined, false)
        act(() => {
          saveDraftButtonSpy()
        })
        expect(mockNavigationSpy).toHaveBeenCalledWith('ComposeMessage', expect.objectContaining({ saveDraftConfirmFailed: true }))
      })

      it('should save and go to drafts folder', async () => {
        act(() => {
          saveDraftButtonSpy()
        })
        expect(mockNavigationSpy).toHaveBeenCalledWith('SecureMessaging')
        expect(mockNavigationSpy).toHaveBeenCalledWith('FolderMessages', expect.objectContaining({ draftSaved: true }))
      })
    })
  })

  describe('Reply', () => {
    describe('on clicking discard', () => {
      it('should go back to the message the user was viewing', async () => {
        initializeTestInstance({ body: 'test reply' }, undefined, true, FormHeaderTypeConstants.reply, 2)
        act(() => {
          discardButtonSpy()
        })
        expect(mockNavigationSpy).toHaveBeenCalledWith('ViewMessageScreen', { messageID: 2 })
      })
    })

    describe('on clicking save draft', () => {
      it('should save and go to drafts folder', async () => {
        initializeTestInstance({ body: 'test reply' }, undefined, true, FormHeaderTypeConstants.reply, 2)
        act(() => {
          saveDraftButtonSpy()
        })
        expect(mockNavigationSpy).toHaveBeenCalledWith('SecureMessaging')
        expect(mockNavigationSpy).toHaveBeenCalledWith('FolderMessages', expect.objectContaining({ draftSaved: true }))
      })
    })
  })

  describe('Draft', () => {
    describe('on clicking discard', () => {
      it('should go back to drafts folder', async () => {
        initializeTestInstance({ body: 'test reply' }, 1, true, FormHeaderTypeConstants.draft, undefined)
        act(() => {
          discardButtonSpy()
        })
        expect(mockNavigationSpy).toHaveBeenCalledWith('FolderMessages', { draftSaved: false, folderID: -2, folderName: 'Drafts' })
      })
    })

    describe('on clicking save draft', () => {
      it('should save and go to drafts folder', async () => {
        initializeTestInstance({ body: 'test reply' }, 1, true, FormHeaderTypeConstants.draft, undefined)
        act(() => {
          saveDraftButtonSpy()
        })
        expect(mockNavigationSpy).toHaveBeenCalledWith('FolderMessages', { draftSaved: true, folderID: -2, folderName: 'Drafts' })
      })
    })
  })
})
