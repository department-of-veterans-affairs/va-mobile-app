import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders} from 'testUtils'
import {TextView, VAButton} from 'components'
import NoFolderMessages from './NoFolderMessages'
import {updateSecureMessagingTab} from 'store/actions'

jest.mock('../../../../store/actions', () => {
  let actual = jest.requireActual('../../../../store/actions')
  return {
    ...actual,
    updateSecureMessagingTab: jest.fn(() => {
      return {
        type: '',
        payload: ''
      }
    })
  }
})

const mockNavigationSpy = jest.fn()
jest.mock('../../../../utils/hooks', () => {
  const original = jest.requireActual('../../../../utils/hooks')
  const theme = jest.requireActual('../../../../styles/themes/standardTheme').default
  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
    useRouteNavigation: () => {
      return () => mockNavigationSpy
    },
  }
})

context('NoFolderMessages', () => {
  let component: any
  let store: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = () => {
    act(() => {
      component = renderWithProviders(
        <NoFolderMessages folderName={'test'} />, store
      )
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should render text fields correctly', async () => {
    const texts = testInstance.findAllByType(TextView)
    expect(texts[0].props.children).toBe('You don\'t have any messages in your test folder')
  })

  describe('on click of the go to inbox button', () => {
    it('should call updateSecureMessagingTab and useRouteNavigation', async () => {
      testInstance.findByType(VAButton).props.onPress()
      expect(updateSecureMessagingTab).toHaveBeenCalled()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })
})

context('NoDrafts', () => {
  let component: any
  let store: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = () => {
    act(() => {
      component = renderWithProviders(
        <NoFolderMessages folderName={'Drafts'} />, store
      )
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should render text fields correctly', async () => {
    const texts = testInstance.findAllByType(TextView)
    expect(texts[0].props.children).toBe('You don\'t have any drafts in your Drafts folder')
  })

  describe('on click of the go to inbox button', () => {
    it('should call updateSecureMessagingTab and useRouteNavigation', async () => {
      testInstance.findByType(VAButton).props.onPress()
      expect(updateSecureMessagingTab).toHaveBeenCalled()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })
})
