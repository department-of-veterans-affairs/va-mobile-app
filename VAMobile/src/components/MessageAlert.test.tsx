import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, findByTypeWithText, renderWithProviders } from 'testUtils'
import { AlertBox, LoadingComponent, MessageAlert, TextView } from 'components'

context('MessageAlert', () => {
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = ({
    hasValidationError,
    saveDraftAttempted,
    saveDraftComplete,
    saveDraftFailed,
    savingDraft,
    sendMessageFailed,
  }: {
    hasValidationError?: boolean
    saveDraftAttempted?: boolean
    saveDraftComplete?: boolean
    saveDraftFailed?: boolean
    savingDraft?: boolean
    sendMessageFailed?: boolean
  }): void => {
    act(() => {
      component = renderWithProviders(
        <MessageAlert
          hasValidationError={hasValidationError}
          saveDraftAttempted={saveDraftAttempted}
          saveDraftComplete={saveDraftComplete}
          saveDraftFailed={saveDraftFailed}
          savingDraft={savingDraft}
          sendMessageFailed={sendMessageFailed}
        />,
      )
    })
    testInstance = component.root
  }

  it('displays save draft success', async () => {
    initializeTestInstance({ hasValidationError: false, saveDraftAttempted: true, saveDraftComplete: true })
    expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
  })

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

  it('should show loading screen when saving draft', async () => {
    initializeTestInstance({ saveDraftAttempted: true, savingDraft: true })
    expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
  })

  it('should handle draft saving error', async () => {
    initializeTestInstance({ saveDraftAttempted: true, saveDraftFailed: true })
    expect(findByTypeWithText(testInstance, TextView, "We couldn't save your draft")).toBeTruthy()
    expect(findByTypeWithText(testInstance, TextView, 'Please try again later')).toBeTruthy()
  })
})
