import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'
import { screen, fireEvent } from '@testing-library/react-native'

import * as api from 'store/api'
import { context, mockNavProps, render, RenderAPI, waitFor, when } from 'testUtils'
import SecureMessaging from './SecureMessaging'
import { updateSecureMessagingTab, InitialState } from 'store/slices'
import { TouchableOpacity } from 'react-native'
import { SecureMessagingSystemFolderIdConstants } from 'store/api/types'
import { ErrorComponent } from 'components/CommonErrorComponents'
import NotEnrolledSM from './NotEnrolledSM/NotEnrolledSM'

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
  }
})

context('SecureMessaging', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any

  const initializeTestInstance = (authorizedSM = true) => {
    props = mockNavProps()

    component = render(<SecureMessaging {...props} />, {
      preloadedState: {
        ...InitialState,
      },
    })

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    await waitFor(() => {
      expect(component).toBeTruthy()
    })
  })

  describe('when user is not authorized for secure messaging', () => {
    it('should display NotEnrolledSM component', async () => {
      await waitFor(() => {
        initializeTestInstance(false)
      })

      expect(testInstance.findAllByType(NotEnrolledSM).length).toEqual(1)
    })
  })

  describe('when common error occurs', () => {
    it('should render the error component', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`, expect.anything())
        .mockRejectedValue({ networkError: true } as api.APIError)
        .calledWith(`/v0/messaging/health/folders`, expect.anything())
        .mockRejectedValue({ networkError: true } as api.APIError)

      await waitFor(() => {
        initializeTestInstance()
      })

      expect(testInstance.findAllByType(ErrorComponent).length).toEqual(1)
    })
  })

  describe('when loading messages error occurs', () => {
    it('should render the loading messages error component', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`, expect.anything())
        .mockRejectedValue({ networkError: false, status: 500 } as api.APIError)
        .calledWith(`/v0/messaging/health/folders`, expect.anything())
        .mockRejectedValue({ networkError: false, status: 500 } as api.APIError)

      await waitFor(() => {
        initializeTestInstance()
      })

      expect(testInstance.findAllByType(ErrorComponent).length).toEqual(1)
      expect(testInstance.findByProps({ phone: '877-327-0022' })).toBeTruthy()
    })
  })

  describe('on click of a segmented control tab', () => {
    it('should call updateSecureMessagingTab', async () => {
      await waitFor(() => {
        initializeTestInstance()
        fireEvent.press(screen.getByText('Folders'))
      })

      expect(updateSecureMessagingTab).toHaveBeenCalled()
    })
  })
})
