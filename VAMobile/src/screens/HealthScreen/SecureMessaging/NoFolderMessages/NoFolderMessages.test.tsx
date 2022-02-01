import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, render, RenderAPI } from 'testUtils'
import { TextView, VAButton } from 'components'
import NoFolderMessages from './NoFolderMessages'
import { updateSecureMessagingTab } from 'store/slices'
import { when } from 'jest-when'

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

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default
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

context('NoFolderMessages', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  const mockNavigateToSpy = jest.fn()

  const initializeTestInstance = () => {
    when(mockNavigationSpy).mockReturnValue(() => {}).calledWith('SecureMessaging').mockReturnValue(mockNavigateToSpy)
    mockNavigationSpy.mockReturnValueOnce(() => {}).mockReturnValueOnce(mockNavigateToSpy)
    component = render(<NoFolderMessages folderName={'test'} />)

    testInstance = component.container
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should render text fields correctly', async () => {
    const texts = testInstance.findAllByType(TextView)
    expect(texts[0].props.children).toBe("You don't have any messages in your test folder")
  })

  describe('on click of the go to inbox button', () => {
    it('should call updateSecureMessagingTab and useRouteNavigation', async () => {
      testInstance.findByType(VAButton).props.onPress()
      expect(updateSecureMessagingTab).toHaveBeenCalled()
      expect(mockNavigateToSpy).toHaveBeenCalled()
    })
  })
})

context('NoDrafts', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  const mockNavigateToSpy = jest.fn()

  const initializeTestInstance = () => {
    when(mockNavigationSpy).mockReturnValue(() => {}).calledWith('SecureMessaging').mockReturnValue(mockNavigateToSpy)
    component = render(<NoFolderMessages folderName={'Drafts'} />)
    testInstance = component.container
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should render text fields correctly', async () => {
    const texts = testInstance.findAllByType(TextView)
    expect(texts[0].props.children).toBe("You don't have any drafts in your Drafts folder")
  })

  describe('on click of the go to inbox button', () => {
    it('should call updateSecureMessagingTab and useRouteNavigation', async () => {
      testInstance.findByType(VAButton).props.onPress()
      expect(updateSecureMessagingTab).toHaveBeenCalled()
      expect(mockNavigateToSpy).toHaveBeenCalled()
    })
  })
})
