import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, findByTypeWithText, render, RenderAPI } from 'testUtils'
import { AlertBox, MessageAlert, TextView } from 'components'

context('MessageAlert', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = ({
    hasValidationError,
    saveDraftAttempted,
    savingDraft,
  }: {
    hasValidationError?: boolean
    saveDraftAttempted?: boolean
    savingDraft?: boolean
  }): void => {
    component = render(<MessageAlert hasValidationError={hasValidationError} saveDraftAttempted={saveDraftAttempted} />)

    testInstance = component.UNSAFE_root
  }

  it('displays save draft validation', async () => {
    initializeTestInstance({ hasValidationError: true, saveDraftAttempted: true })
    expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
    expect(findByTypeWithText(testInstance, TextView, 'Recheck information')).toBeTruthy()
    expect(findByTypeWithText(testInstance, TextView, 'In order to save this draft, all of the required fields must be filled.')).toBeTruthy()
  })

  it('displays send validation', async () => {
    initializeTestInstance({ hasValidationError: true })
    expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
    expect(findByTypeWithText(testInstance, TextView, 'Check your message')).toBeTruthy()
  })
})
