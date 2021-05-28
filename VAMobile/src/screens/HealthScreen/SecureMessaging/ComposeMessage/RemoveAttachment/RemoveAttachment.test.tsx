import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, mockNavProps, renderWithProviders} from 'testUtils'
import RemoveAttachment from './RemoveAttachment'
import {VAButton} from 'components'

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

context('RemoveAttachment', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any

  beforeEach(() => {
    props = mockNavProps(undefined, { goBack: jest.fn(), setOptions: jest.fn() }, { params: { attachmentFileToRemove: {} } })

    act(() => {
      component = renderWithProviders(<RemoveAttachment {...props}/>)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('on click of the yes remove attachment button', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findAllByType(VAButton)[0].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })
})
