import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders} from 'testUtils'
import { TextView } from 'components'
import NoFolderMessages from './NoFolderMessages'

context('NoInboxMessages', () => {
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
})
