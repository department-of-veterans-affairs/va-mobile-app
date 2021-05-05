import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import { context, renderWithProviders } from 'testUtils'

import FormAttachments from './FormAttachments'
import TextView from '../../TextView'
import {Pressable} from 'react-native'

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual("utils/hooks")
  let theme = jest.requireActual("styles/themes/standardTheme").default
  return {
    ...original,
    useTheme: jest.fn(()=> {
      return {...theme}
    }),
    useRouteNavigation: () => { return () => mockNavigationSpy},
  }
})

context('FormAttachments', () => {
  let component: any
  let testInstance: ReactTestInstance
  let removeOnPressSpy: jest.Mock
  let largeButtonSpy: jest.Mock

  const attachmentsList = [
    {
      uri: '',
      fileCopyUri: '',
      type: '',
      name: 'file.txt',
      size: 10,
    },
    {
      uri: '',
      fileName: 'image.jpeg',
    },
  ]

  const initializeTestInstance = (attachments = attachmentsList) => {
    removeOnPressSpy = jest.fn()
    largeButtonSpy = jest.fn()

    act(() => {
      component = renderWithProviders(<FormAttachments originHeader='test header' removeOnPress={removeOnPressSpy} largeButtonProps={{ label: 'add files', onPress: largeButtonSpy }} attachmentsList={attachments}/>)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when there are attachments', () => {
    it('should display a remove link', async () => {
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('Remove')
    })

    describe('when the remove link is clicked for an attachment', () => {
      it('should call the removeOnPress', async () => {
        testInstance.findAllByType(TextView)[3].props.onPress()
        expect(removeOnPressSpy).toHaveBeenCalled()
      })
    })
  })

  describe('when there are no attachments', () => {
    it('should not display a remove link', async () => {
      initializeTestInstance([])
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Attachments')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('How to attach a file')
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('add files')
    })
  })

  describe('when the large button is clicked', () => {
    it('should call the largeButtonOnClick', async () => {
      const pressables = testInstance.findAllByType(Pressable)
      pressables[pressables.length - 1].props.onPress()
      expect(largeButtonSpy).toHaveBeenCalled()
    })
  })

  describe('on click of the "How to attach a file" link', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findAllByType(Pressable)[0].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })
})
