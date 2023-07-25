import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { context, mockNavProps, render, RenderAPI } from 'testUtils'
import { act, ReactTestInstance } from 'react-test-renderer'

import SelectFile from './SelectFile'
import { VAButton } from 'components'

let mockShowActionSheetWithOptions = jest.fn()
jest.mock('@expo/react-native-action-sheet', () => {
  let original = jest.requireActual('@expo/react-native-action-sheet')
  return {
    ...original,
    useActionSheet: () => {
      return { showActionSheetWithOptions: mockShowActionSheetWithOptions }
    },
  }
})

jest.mock('react-native-image-picker', () => {
  let original = jest.requireActual('react-native-image-picker')
  return {
    ...original,
    launchImageLibrary: jest.fn(),
  }
})

context('SelectFile', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any

  let request = {
    type: 'still_need_from_you_list',
    date: '2020-07-16',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true,
  }

  const initializeTestInstance = () => {
    props = mockNavProps(undefined, { addListener: jest.fn(), setOptions: jest.fn() }, { params: { request } })

    component = render(<SelectFile {...props} />)

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('on click of select a file', () => {
    it('should call showActionSheetWithOptions and display the action sheet', async () => {
      testInstance.findByType(VAButton).props.onPress()

      expect(mockShowActionSheetWithOptions).toHaveBeenCalled()

      const actionSheetConfig = mockShowActionSheetWithOptions.mock.calls[0][0]
      expect(actionSheetConfig.options).toEqual(['File Folder', 'Cancel'])
    })
  })
})
