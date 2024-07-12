import React from 'react'

import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types'
import { initialErrorsState, initializeErrorsByScreenID } from 'store/slices'
import { context, fireEvent, render, screen } from 'testUtils'

import ErrorComponent from './ErrorComponent'

context('ErrorComponent', () => {
  const onTryAgainPressSpy = jest.fn()

  beforeEach(() => {
    const errorsByScreenID = initializeErrorsByScreenID()
    errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] =
      CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

    render(
      <ErrorComponent
        onTryAgain={onTryAgainPressSpy}
        screenID={ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID}
      />,
      {
        preloadedState: {
          errors: {
            ...initialErrorsState,
            errorsByScreenID,
          },
        },
      },
    )
  })

  it('initializes correctly', () => {
    expect(screen.getByText("The app can't be loaded.")).toBeTruthy()
    expect(screen.getByRole('header', { name: "The app can't be loaded." })).toBeTruthy()
  })
  it('should call onTryAgain', () => {
    fireEvent.press(screen.getByRole('button', { name: 'Refresh screen' }))
    expect(onTryAgainPressSpy).toHaveBeenCalled()
  })
})
